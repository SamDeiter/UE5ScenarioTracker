import os
import re
import glob

# Map filenames to appropriate categories
category_mapping = {
    # Asset Management
    'assetmanagement_advanced.js': 'Asset Management',
    'assetmanagement_beginner.js': 'Asset Management',
    'assetmanagement_intermediate.js': 'Asset Management',
    
    # Audio
    'audio_concurrency.js': 'Audio',
    
    # Blueprints
    'blueprintslogic_advanced.js': 'Blueprints',
    'blueprintslogic_beginner.js': 'Blueprints',
    'blueprintslogic_intermediate.js': 'Blueprints',
    'blueprint_infinite_loop.js': 'Blueprints',
    
    # Cinematics
    'sequencercinematics_advanced.js': 'Cinematics',
    'sequencercinematics_beginner.js': 'Cinematics',
    'sequencercinematics_intermediate.js': 'Cinematics',
    
    # Lighting/Rendering
    'lightingrendering_advanced.js': 'Lighting',
    'lightingrendering_beginner.js': 'Lighting',
    'lightingrendering_intermediate.js': 'Lighting',
    'lumen_gi.js': 'Lighting',
    'lumen_mesh_distance.js': 'Lighting',
    
    # Materials
    'materialsshaders_advanced.js': 'Materials',
    'materialsshaders_beginner.js': 'Materials',
    'materialsshaders_intermediate.js': 'Materials',
    'volumetric_fog_material.js': 'Materials',
    
    # Nanite
    'nanite_wpo.js': 'Nanite',
    
    # Performance
    'dash.js': 'Performance',
    
    # Physics
    'physicscollisions_advanced.js': 'Physics',
    'physicscollisions_beginner.js': 'Physics',
    'physicscollisions_intermediate.js': 'Physics',
    
    # Post-Processing
    'oversharpened_scene.js': 'Post-Processing',
    
    # Procedural Generation
    'generator.js': 'Procedural Generation',
    
    # AI/Gameplay
    'golem.js': 'AI/Gameplay',
    
    # UI/Systems
    'inventory.js': 'UI/Systems',
    
    # UI/UX
    'terminal.js': 'UI/UX',
    
    # Volumetrics
    'volumetric_fog_banding.js': 'Volumetrics',
    
    # World Partition
    'worldpartition_advanced.js': 'World Partition',
    'worldpartition_beginner.js': 'World Partition',
    'worldpartition_intermediate.js': 'World Partition',
    'world_partition.js': 'World Partition',
}

js_files = glob.glob('scenarios/*.js')
files_modified = 0

for filepath in js_files:
    filename = os.path.basename(filepath)
    
    if filename not in category_mapping:
        print(f"⚠️  No category mapping for: {filename}")
        continue
    
    category = category_mapping[filename]
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if category already exists
    if re.search(r'category:\s*["\']', content):
        print(f"✓ {filename} already has category")
        continue
    
    # Add category after difficulty or estimateHours
    if 'difficulty:' in content:
        # Add after difficulty
        new_content = re.sub(
            r'(difficulty:\s*["\'][^"\']+["\'])',
            f'\\1,\n        category: "{category}"',
            content
        )
    elif 'estimateHours:' in content:
        # Add after estimateHours
        new_content = re.sub(
            r'(estimateHours:\s*[\d.]+)',
            f'\\1,\n        category: "{category}"',
            content
        )
    else:
        # Add after description
        new_content = re.sub(
            r'(description:\s*["\'][^"\']+["\'])',
            f'\\1,\n        category: "{category}"',
            content
        )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        files_modified += 1
        print(f"✅ Added category '{category}' to {filename}")

print(f"\n{'='*60}")
print(f"Modified {files_modified} files")
