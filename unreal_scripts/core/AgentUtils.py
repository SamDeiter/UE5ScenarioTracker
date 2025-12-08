"""
Agent Utilities for Unreal Engine Python API

This module implements best practices from the AI Agent Integration framework,
providing robust patterns for:
- Modern Subsystem access (UE5+)
- Asset Registry queries without loading
- API Introspection and validation
- Time-sliced async operations
- Error recovery via log parsing

Reference: Help.md - "The Autonomous Architect: A Comprehensive Framework for 
AI Agent Integration via the Unreal Engine Python API"
"""

import unreal
import re
from typing import List, Dict, Optional, Callable, Any


# =============================================================================
# Section 2.2: Modern Subsystems (Short-Term Memory)
# =============================================================================

class EditorSubsystems:
    """
    Provides access to modern UE5 Editor Subsystems.
    
    Per Help.md Section 2.2: "The transition from older utility libraries to the 
    Subsystem architecture (UE5+) provides a more robust and context-aware interface."
    
    Use these instead of legacy EditorLevelLibrary when possible.
    """
    
    @staticmethod
    def get_actor_subsystem() -> unreal.EditorActorSubsystem:
        """Get the Editor Actor Subsystem for actor operations"""
        return unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
    
    @staticmethod
    def get_level_subsystem() -> unreal.LevelEditorSubsystem:
        """Get the Level Editor Subsystem for level/camera operations"""
        return unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
    
    @staticmethod
    def get_asset_subsystem() -> unreal.EditorAssetSubsystem:
        """Get the Editor Asset Subsystem for asset operations"""
        return unreal.get_editor_subsystem(unreal.EditorAssetSubsystem)
    
    @staticmethod
    def get_all_actors() -> List[unreal.Actor]:
        """
        Get all level actors using modern subsystem.
        Recommended over EditorLevelLibrary.get_all_level_actors()
        """
        subsystem = EditorSubsystems.get_actor_subsystem()
        if subsystem:
            return subsystem.get_all_level_actors()
        # Fallback to legacy
        return unreal.EditorLevelLibrary.get_all_level_actors()
    
    @staticmethod
    def get_selected_actors() -> List[unreal.Actor]:
        """Get currently selected actors"""
        subsystem = EditorSubsystems.get_actor_subsystem()
        if subsystem:
            return subsystem.get_selected_level_actors()
        return unreal.EditorLevelLibrary.get_selected_level_actors()
    
    @staticmethod
    def get_viewport_camera_info():
        """
        Get viewport camera location and rotation.
        
        Returns:
            tuple: (unreal.Vector location, unreal.Rotator rotation)
        """
        # Use EditorLevelLibrary which is the reliable API for viewport camera
        # LevelEditorSubsystem.get_level_viewport_camera_info() doesn't exist in all UE5 versions
        try:
            location, rotation = unreal.EditorLevelLibrary.get_level_viewport_camera_info()
            return location, rotation
        except Exception:
            pass
        
        # Fallback - return zeros
        return unreal.Vector(0, 0, 0), unreal.Rotator(0, 0, 0)
    
    @staticmethod
    def set_viewport_camera(location: unreal.Vector, rotation: unreal.Rotator):
        """Set viewport camera position and rotation"""
        unreal.EditorLevelLibrary.set_level_viewport_camera_info(location, rotation)


# =============================================================================
# Section 2.1: Asset Registry (Long-Term Memory)
# =============================================================================

class AssetInspector:
    """
    Queries the Asset Registry for asset information WITHOUT loading assets.
    
    Per Help.md Section 2.1: "An agent... does not need to load every texture 
    (which would exhaust system RAM). Instead, it queries the Asset Registry."
    """
    
    @staticmethod
    def get_registry() -> unreal.AssetRegistry:
        """Get the Asset Registry instance"""
        return unreal.AssetRegistryHelpers.get_asset_registry()
    
    @staticmethod
    def find_assets_by_class(class_name: str, search_path: str = "/Game/") -> List[unreal.AssetData]:
        """
        Find all assets of a specific class without loading them.
        
        Args:
            class_name: The class name (e.g., 'StaticMesh', 'Texture2D', 'Material')
            search_path: Path to search under (default: "/Game/")
            
        Returns:
            List of AssetData objects (lightweight metadata, not loaded assets)
        """
        registry = AssetInspector.get_registry()
        
        # Build filter
        filter = unreal.ARFilter()
        filter.class_names = [class_name]
        filter.package_paths = [search_path]
        filter.recursive_paths = True
        
        return registry.get_assets(filter)
    
    @staticmethod
    def asset_exists(asset_path: str) -> bool:
        """
        Check if an asset exists at the given path WITHOUT loading it.
        
        Args:
            asset_path: Full asset path (e.g., "/Game/Materials/M_Default")
            
        Returns:
            bool: True if asset exists
        """
        registry = AssetInspector.get_registry()
        asset_data = registry.get_asset_by_object_path(asset_path)
        return asset_data.is_valid()
    
    @staticmethod
    def get_asset_references(asset_path: str) -> List[str]:
        """
        Get all assets that reference this asset.
        
        Per Help.md: "If an agent decides to delete a 'deprecated' asset, 
        it can first verify that the asset has zero references."
        
        Args:
            asset_path: Path to the asset
            
        Returns:
            List of paths to assets that reference this one
        """
        registry = AssetInspector.get_registry()
        dependencies = registry.get_referencers(asset_path)
        return [str(dep) for dep in dependencies]
    
    @staticmethod
    def get_asset_dependencies(asset_path: str) -> List[str]:
        """
        Get all assets that this asset depends on.
        
        Args:
            asset_path: Path to the asset
            
        Returns:
            List of dependency paths
        """
        registry = AssetInspector.get_registry()
        dependencies = registry.get_dependencies(asset_path)
        return [str(dep) for dep in dependencies]


# =============================================================================
# Section 1.2: Introspection (The Agent's Nervous System)
# =============================================================================

class APIIntrospector:
    """
    Dynamic API discovery and validation.
    
    Per Help.md Section 1.2: "An agent does not need to be hard-coded with 
    every possible function name. Instead, it can dynamically query the API 
    to discover capabilities."
    """
    
    @staticmethod
    def get_class_properties(uclass: unreal.Class) -> List[str]:
        """
        Get all properties exposed on a UClass.
        
        Useful for LLM agents to discover what can be modified.
        """
        # Use Python introspection on the CDO (Class Default Object)
        cdo = uclass.get_default_object()
        return [attr for attr in dir(cdo) if not attr.startswith('_')]
    
    @staticmethod
    def has_method(obj: Any, method_name: str) -> bool:
        """Check if an object has a specific method"""
        return hasattr(obj, method_name) and callable(getattr(obj, method_name))
    
    @staticmethod
    def get_actor_components(actor: unreal.Actor) -> List[Dict]:
        """
        Get all components attached to an actor with their types.
        
        Returns:
            List of dicts with 'name', 'class', and 'component' keys
        """
        components = []
        for comp in actor.get_components_by_class(unreal.ActorComponent):
            components.append({
                'name': comp.get_name(),
                'class': comp.get_class().get_name(),
                'component': comp
            })
        return components
    
    @staticmethod
    def validate_asset_path(asset_path: str) -> Dict:
        """
        Validate an asset path before attempting to load.
        
        Returns:
            dict with 'valid', 'exists', 'class_name' keys
        """
        result = {
            'valid': False,
            'exists': False,
            'class_name': None,
            'error': None
        }
        
        if not asset_path or not asset_path.startswith('/'):
            result['error'] = "Invalid asset path format"
            return result
            
        result['valid'] = True
        
        # Check registry without loading
        if AssetInspector.asset_exists(asset_path):
            result['exists'] = True
            registry = AssetInspector.get_registry()
            asset_data = registry.get_asset_by_object_path(asset_path)
            if asset_data.is_valid():
                result['class_name'] = str(asset_data.asset_class)
        
        return result


# =============================================================================
# Section 2.3: Spatial Perception (Raycasting)
# =============================================================================

class SpatialSensor:
    """
    Raycasting utilities for spatial perception.
    
    Per Help.md Section 2.3: "An AI agent often needs to 'see' geometry to place 
    objects intelligently (e.g., ensuring a spawned tree sits on the ground)."
    """
    
    @staticmethod
    def trace_to_ground(x: float, y: float, height: float = 10000.0) -> Optional[Dict]:
        """
        Fire a ray downward to find the ground at (x, y).
        
        Args:
            x, y: Horizontal coordinates
            height: Starting height (default 10000)
            
        Returns:
            dict with 'location', 'normal', 'actor' or None if no hit
        """
        start = unreal.Vector(x, y, height)
        end = unreal.Vector(x, y, -height)
        
        # Perform trace
        hit_result = unreal.SystemLibrary.line_trace_single(
            None,  # World context (None uses current world)
            start,
            end,
            unreal.TraceTypeQuery.TRACE_TYPE_QUERY1,
            False,  # Trace complex
            [],  # Actors to ignore
            unreal.DrawDebugTrace.NONE,
            True  # Ignore self
        )
        
        if hit_result:
            return {
                'location': hit_result.impact_point,
                'normal': hit_result.impact_normal,
                'actor': hit_result.get_actor() if hit_result.get_actor() else None,
                'distance': hit_result.distance
            }
        return None
    
    @staticmethod
    def is_surface_walkable(normal: unreal.Vector, max_slope_degrees: float = 45.0) -> bool:
        """
        Check if a surface normal indicates a walkable slope.
        
        Args:
            normal: The surface normal vector
            max_slope_degrees: Maximum walkable slope (default 45°)
            
        Returns:
            bool: True if surface is walkable
        """
        up = unreal.Vector(0, 0, 1)
        dot = normal.dot(up)
        # dot of 1 = flat, dot of 0 = vertical wall
        import math
        angle = math.degrees(math.acos(min(1, max(-1, dot))))
        return angle <= max_slope_degrees


# =============================================================================
# Section 1.3: Time-Slicing via Callbacks
# =============================================================================

class AsyncTaskRunner:
    """
    Time-sliced task execution to keep editor responsive.
    
    Per Help.md Section 1.3: "The agent should break tasks into small chunks, 
    process a batch, and then yield control back to the engine."
    
    Usage:
        runner = AsyncTaskRunner()
        runner.run_async(my_generator_function())
    """
    
    def __init__(self):
        self.callback_handle = None
        self.task_generator = None
        self.on_complete_callback = None
    
    def run_async(self, generator, on_complete: Callable = None):
        """
        Run a generator function asynchronously, yielding between frames.
        
        Args:
            generator: A Python generator that yields between work units
            on_complete: Optional callback when done
        """
        self.task_generator = generator
        self.on_complete_callback = on_complete
        
        # Register tick callback
        self.callback_handle = unreal.register_slate_post_tick_callback(self._tick)
        unreal.log("AsyncTaskRunner: Started async task")
    
    def _tick(self, delta_time: float):
        """Called each frame by Slate"""
        if self.task_generator is None:
            self._cleanup()
            return
        
        try:
            # Process one step
            next(self.task_generator)
        except StopIteration:
            # Generator finished
            unreal.log("AsyncTaskRunner: Task completed")
            if self.on_complete_callback:
                self.on_complete_callback()
            self._cleanup()
        except Exception as e:
            unreal.log_error(f"AsyncTaskRunner: Error - {e}")
            self._cleanup()
    
    def _cleanup(self):
        """Clean up callback registration"""
        if self.callback_handle:
            unreal.unregister_slate_post_tick_callback(self.callback_handle)
            self.callback_handle = None
        self.task_generator = None
    
    def cancel(self):
        """Cancel the running task"""
        unreal.log("AsyncTaskRunner: Task cancelled")
        self._cleanup()


class FrameDelayedAction:
    """
    Execute an action after waiting for N frames.
    
    Useful for waiting for viewport to render before screenshot.
    """
    
    def __init__(self, frames_to_wait: int, action: Callable):
        self.frames_remaining = frames_to_wait
        self.action = action
        self.callback_handle = None
    
    def start(self):
        """Start the delayed action"""
        self.callback_handle = unreal.register_slate_post_tick_callback(self._tick)
    
    def _tick(self, delta_time: float):
        if self.frames_remaining > 0:
            self.frames_remaining -= 1
            return
        
        # Execute action
        try:
            self.action()
        finally:
            # Cleanup
            if self.callback_handle:
                unreal.unregister_slate_post_tick_callback(self.callback_handle)
                self.callback_handle = None


# =============================================================================
# Section 2.4: Error Recovery via Log Parsing
# =============================================================================

class ErrorRecovery:
    """
    Parse output log for error recovery.
    
    Per Help.md Section 2.4: "By monitoring the log, the agent can implement 
    Error Recovery. If it attempts to save an asset and receives a 'File Locked' 
    error, it can parse this error, trigger a Checkout command, and retry."
    """
    
    # Common error patterns
    ERROR_PATTERNS = {
        'asset_not_found': r'LogUObjectGlobals: Warning: Failed to find object \'(.+)\'',
        'file_locked': r'Source Control.*locked by',
        'import_failed': r'Import Failed: (.+)',
        'compile_error': r'Error: (.+) Compile',
        'cook_error': r'Cook Error: (.+)',
    }
    
    @staticmethod
    def parse_error(log_message: str) -> Optional[Dict]:
        """
        Parse a log message for known error patterns.
        
        Args:
            log_message: The log message to parse
            
        Returns:
            dict with 'type' and 'details' if error found, None otherwise
        """
        for error_type, pattern in ErrorRecovery.ERROR_PATTERNS.items():
            match = re.search(pattern, log_message)
            if match:
                return {
                    'type': error_type,
                    'details': match.group(1) if match.groups() else log_message
                }
        return None
    
    @staticmethod
    def suggest_recovery(error_type: str) -> str:
        """
        Suggest a recovery action for a known error type.
        
        Returns:
            str: Suggested recovery action
        """
        suggestions = {
            'asset_not_found': "Verify asset path exists using AssetInspector.asset_exists()",
            'file_locked': "Check source control status or wait for file to be released",
            'import_failed': "Check source file format and import settings",
            'compile_error': "Review Blueprint or C++ for syntax errors",
            'cook_error': "Check asset references and cooking settings",
        }
        return suggestions.get(error_type, "Unknown error - check log for details")


# =============================================================================
# Section 4.2: HISM Optimization
# =============================================================================

class HISMOptimizer:
    """
    Hierarchical Instanced Static Mesh optimization for batch spawning.
    
    Per Help.md Section 4.2: "A naive agent spawning 10,000 individual 
    StaticMeshActors will degrade Editor performance. A sophisticated agent 
    utilizes HISM components."
    """
    
    @staticmethod
    def create_instanced_mesh_actor(
        mesh_path: str,
        transforms: List[unreal.Transform],
        actor_label: str = "InstancedMeshes"
    ) -> Optional[unreal.Actor]:
        """
        Create a single HISM actor with multiple instances.
        
        Args:
            mesh_path: Path to the static mesh asset
            transforms: List of transforms for each instance
            actor_label: Label for the actor
            
        Returns:
            The created HISM actor, or None if failed
        """
        if not transforms:
            return None
        
        # Load mesh
        mesh = unreal.load_asset(mesh_path)
        if not mesh:
            unreal.log_warning(f"HISMOptimizer: Could not load mesh {mesh_path}")
            return None
        
        # Spawn HISM actor
        actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
            unreal.HierarchicalInstancedStaticMeshActor,
            transforms[0].translation,
            transforms[0].rotation.rotator()
        )
        
        if not actor:
            return None
        
        actor.set_actor_label(actor_label)
        
        # Get HISM component
        hism_comp = actor.get_component_by_class(
            unreal.HierarchicalInstancedStaticMeshComponent
        )
        
        if not hism_comp:
            # Create component if not present
            hism_comp = actor.add_component_by_class(
                unreal.HierarchicalInstancedStaticMeshComponent
            )
        
        # Set mesh
        hism_comp.set_static_mesh(mesh)
        
        # Add all instances (skip first as it's the actor position)
        for i, transform in enumerate(transforms):
            hism_comp.add_instance(transform)
        
        unreal.log(f"HISMOptimizer: Created {len(transforms)} instances")
        return actor


# =============================================================================
# Convenience Functions
# =============================================================================

def invalidate_and_wait(frames: int = 5) -> None:
    """
    Invalidate viewports and wait for rendering.
    Use with FrameDelayedAction for async version.
    
    Args:
        frames: Number of frames to wait (synchronous - blocks!)
    """
    unreal.EditorLevelLibrary.editor_invalidate_viewports()
    # Note: This is blocking! For non-blocking, use FrameDelayedAction
    

def log_scene_summary():
    """Log a summary of the current scene"""
    actors = EditorSubsystems.get_all_actors()
    
    actor_counts = {}
    for actor in actors:
        class_name = actor.get_class().get_name()
        actor_counts[class_name] = actor_counts.get(class_name, 0) + 1
    
    unreal.log("=" * 50)
    unreal.log("Scene Summary:")
    for class_name, count in sorted(actor_counts.items()):
        unreal.log(f"  {class_name}: {count}")
    unreal.log(f"Total Actors: {len(actors)}")
    unreal.log("=" * 50)
