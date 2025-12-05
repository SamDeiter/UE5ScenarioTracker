import os
import re
import json

scenarios_dir = 'scenarios'
results = []

for filename in os.listdir(scenarios_dir):
    if not filename.endswith('.js') or filename.startswith('00_') or filename.endswith('.bak'):
        continue
    
    filepath = os.path.join(scenarios_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract meta info
    meta_match = re.search(r'meta:\s*\{([^}]+)\}', content, re.DOTALL)
    
    title = ""
    estimate = 0
    description = ""
    
    if meta_match:
        meta_content = meta_match.group(1)
        
        # Extract title
        title_match = re.search(r'title:\s*["\']([^"\']+)["\']', meta_content)
        if title_match:
            title = title_match.group(1)
        
        # Extract estimateHours
        estimate_match = re.search(r'estimateHours:\s*([\d.]+)', meta_content)
        if estimate_match:
            estimate = float(estimate_match.group(1))
        
        # Extract description
        desc_match = re.search(r'description:\s*["\']([^"\']+)["\']', meta_content)
        if desc_match:
            description = desc_match.group(1)[:60] + "..."
    
    # Count steps
    steps = re.findall(r"'step-\d+[^']*':", content)
    step_count = len(steps)
    
    # Count unique skills used
    skills = re.findall(r"skill:\s*['\"]([^'\"]+)['\"]", content)
    unique_skills = list(set(skills))
    
    # Extract difficulty
    diff_match = re.search(r'difficulty:\s*["\']([^"\']+)["\']', meta_content)
    if diff_match:
        difficulty = diff_match.group(1)
    else:
        # Categorize difficulty based on filename
        if 'beginner' in filename:
            difficulty = 'Beginner'
        elif 'intermediate' in filename:
            difficulty = 'Intermediate'
        elif 'advanced' in filename:
            difficulty = 'Advanced'
        else:
            difficulty = 'General'
    
    # Categorize by area based on filename and content
    if 'assetmanagement' in filename:
        area = 'Asset Management'
    elif 'blueprint' in filename:
        area = 'Blueprints'
    elif 'lighting' in filename or 'lumen' in filename:
        area = 'Lighting'
    elif 'material' in filename or 'shader' in filename:
        area = 'Materials'
    elif 'physics' in filename or 'collision' in filename:
        area = 'Physics'
    elif 'sequencer' in filename or 'cinematic' in filename:
        area = 'Cinematics'
    elif 'world' in filename or 'partition' in filename:
        area = 'World Partition'
    elif 'audio' in filename:
        area = 'Audio'
    elif 'nanite' in filename:
        area = 'Nanite'
    elif 'fog' in filename or 'volumetric' in filename:
        area = 'Volumetrics'
    # More specific categorization for previously "General" scenarios
    elif 'dash' in filename:
        area = 'Performance'
    elif 'generator' in filename:
        area = 'Procedural Generation'
    elif 'golem' in filename:
        area = 'AI/Gameplay'
    elif 'inventory' in filename:
        area = 'UI/Systems'
    elif 'oversharpened' in filename:
        area = 'Post-Processing'
    elif 'terminal' in filename:
        area = 'UI/UX'
    else:
        area = 'General'
    
    results.append({
        'filename': filename,
        'title': title,
        'difficulty': difficulty,
        'area': area,
        'steps': step_count,
        'estimate': estimate,
        'skills': unique_skills
    })

# Sort by area then difficulty
results.sort(key=lambda x: (x['area'], x['difficulty']))

# Print summary
print("=" * 80)
print("SCENARIO ANALYSIS - Distribution Summary")
print("=" * 80)

# By difficulty
print("\n## By Difficulty:")
for diff in ['Beginner', 'Intermediate', 'Advanced', 'General']:
    count = len([r for r in results if r['difficulty'] == diff])
    print(f"  {diff}: {count}")

# By area
print("\n## By Area:")
area_counts = {}
for r in results:
    area = r['area']
    area_counts[area] = area_counts.get(area, 0) + 1
for area, count in sorted(area_counts.items()):
    print(f"  {area}: {count}")

# By estimate time
print("\n## By Estimated Time:")
short = len([r for r in results if r['estimate'] <= 2])
medium = len([r for r in results if 2 < r['estimate'] <= 5])
long_s = len([r for r in results if r['estimate'] > 5])
print(f"  Short (≤2h): {short}")
print(f"  Medium (2-5h): {medium}")
print(f"  Long (>5h): {long_s}")

# Detail table
print("\n## All Scenarios Detail:")
print(f"{'Filename':<45} {'Difficulty':<12} {'Area':<15} {'Steps':>6} {'Est(h)':>7}")
print("-" * 90)
for r in results:
    print(f"{r['filename']:<45} {r['difficulty']:<12} {r['area']:<15} {r['steps']:>6} {r['estimate']:>7.1f}")

# Identify issues
print("\n" + "=" * 80)
print("ISSUES IDENTIFIED")
print("=" * 80)
print(f"\n1. TIME IMBALANCE:")
print(f"   - Short scenarios: {short} ({short*100//len(results)}%)")
print(f"   - Medium scenarios: {medium} ({medium*100//len(results)}%)")
print(f"   - Long scenarios: {long_s} ({long_s*100//len(results)}%)")

general_count = len([r for r in results if r['difficulty'] == 'General'])
print(f"\n2. DIFFICULTY IMBALANCE:")
print(f"   - 'General' difficulty: {general_count} scenarios (should be categorized)")

print(f"\n3. AREAS WITHOUT FULL COVERAGE:")
for area, count in sorted(area_counts.items()):
    if count < 3:
        print(f"   - {area}: only {count} scenario(s)")
