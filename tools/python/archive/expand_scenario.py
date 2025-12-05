"""
Scenario Expansion Tool
Helps expand short scenarios by adding intermediate debugging steps
"""

import re
import json
import sys
from pathlib import Path

def analyze_scenario(file_path):
    """Analyze a scenario file and return its structure"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract scenario ID
    id_match = re.search(r"window\.SCENARIOS\[['\"](.*?)['\"]\]", content)
    scenario_id = id_match.group(1) if id_match else "unknown"
    
    # Extract metadata
    title_match = re.search(r"title:\s*['\"](.+?)['\"]", content)
    desc_match = re.search(r"description:\s*['\"](.+?)['\"]", content)
    estimate_match = re.search(r"estimate(?:Hours)?:\s*([\d.]+)", content)
    
    # Count steps
    steps_match = re.findall(r"['\"](step[-_]\d+)['\"]:\s*\{", content)
    
    return {
        'id': scenario_id,
        'file': file_path.name,
        'title': title_match.group(1) if title_match else "Unknown",
        'description': desc_match.group(1) if desc_match else "",
        'estimate': float(estimate_match.group(1)) if estimate_match else 0,
        'step_count': len(steps_match),
        'steps': steps_match
    }

def generate_expansion_template(scenario_info):
    """Generate a template for expanding a scenario"""
    
    template = f"""
# Scenario Expansion Plan: {scenario_info['title']}
# Current Steps: {scenario_info['step_count']} → Target: 10-15 steps

## Current Scenario
- ID: {scenario_info['id']}
- File: {scenario_info['file']}
- Description: {scenario_info['description'][:200]}...
- Estimate: {scenario_info['estimate']} hours

## Recommended Expansion Strategy

### Phase 1: Initial Investigation (Steps 1-3)
1. **Identify the Problem** - Player discovers the issue
2. **Gather Information** - Check logs, console commands, or visual inspection
3. **Form Hypothesis** - Initial understanding of what might be wrong

### Phase 2: Debugging & Testing (Steps 4-7)
4. **First Attempt** - Try the most obvious fix
5. **Verify Settings** - Check related configuration
6. **Test Alternative** - Try a different approach if first fails
7. **Deep Dive** - Investigate root cause with debugging tools

### Phase 3: Implementation (Steps 8-10)
8. **Apply Correct Fix** - Implement the proper solution
9. **Validate Fix** - Test that it works
10. **Optimize/Polish** - Ensure best practices

### Optional: Add Wrong Paths (Steps 11-15)
- Add "misguided" choices that lead to dead ends
- Add "partial" solutions that work but aren't optimal
- Add "wrong" choices that make things worse

## Suggested New Steps for This Scenario

Based on the description, here are potential steps to add:

"""
    
    # Suggest steps based on common UE5 debugging patterns
    if 'lighting' in scenario_info['description'].lower() or 'lumen' in scenario_info['description'].lower():
        template += """
1. Check Post Process Volume settings
2. Verify Light Component properties (Mobility, Intensity, etc.)
3. Inspect Static Mesh settings (Distance Fields, Nanite)
4. Use visualization modes (Lumen Scene, Lighting Only)
5. Check Project Settings for Lumen/GI
6. Test with simplified geometry
7. Verify material properties
8. Check for conflicting volumes
9. Validate the fix
10. Document the solution
"""
    elif 'blueprint' in scenario_info['description'].lower():
        template += """
1. Identify the broken behavior
2. Check Event Graph connections
3. Add Print String debug nodes
4. Verify variable values
5. Check execution flow with breakpoints
6. Inspect Cast nodes for failures
7. Review component references
8. Test alternative logic paths
9. Apply the correct fix
10. Validate in PIE
"""
    elif 'material' in scenario_info['description'].lower():
        template += """
1. Identify visual issue
2. Check Material Editor for errors
3. Verify texture assignments
4. Inspect blend modes
5. Check material instance parameters
6. Test with default material
7. Review shader complexity
8. Check for missing nodes
9. Apply correct material setup
10. Validate rendering
"""
    else:
        template += """
1. Identify the issue
2. Gather diagnostic information
3. Check relevant settings
4. Test initial hypothesis
5. Use debugging tools
6. Investigate root cause
7. Try alternative approaches
8. Apply the fix
9. Validate the solution
10. Optimize if needed
"""
    
    return template

def main():
    if len(sys.argv) < 2:
        print("Usage: python expand_scenario.py <scenario_file.js>")
        print("\nThis tool analyzes a scenario and provides an expansion plan.")
        sys.exit(1)
    
    scenario_file = Path(sys.argv[1])
    
    if not scenario_file.exists():
        print(f"Error: File not found: {scenario_file}")
        sys.exit(1)
    
    print(f"\n{'='*60}")
    print(f"Analyzing: {scenario_file.name}")
    print(f"{'='*60}\n")
    
    info = analyze_scenario(scenario_file)
    
    print(f"Scenario ID: {info['id']}")
    print(f"Title: {info['title']}")
    print(f"Current Steps: {info['step_count']}")
    print(f"Current Estimate: {info['estimate']} hours")
    print(f"\nSteps found: {', '.join(info['steps'])}")
    
    if info['step_count'] >= 10:
        print(f"\n✅ This scenario already has {info['step_count']} steps (adequate length)")
    else:
        print(f"\n⚠️  This scenario needs expansion ({info['step_count']} → 10+ steps)")
        
        # Generate expansion plan
        plan = generate_expansion_template(info)
        
        # Save to file
        output_file = scenario_file.parent.parent / 'docs' / f"expansion_plan_{info['id']}.txt"
        output_file.parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(plan)
        
        print(f"\n📝 Expansion plan saved to: {output_file}")
        print("\nNext steps:")
        print("1. Review the expansion plan")
        print("2. Manually edit the scenario file to add new steps")
        print("3. Follow the structure from golem.js or dash.js as examples")

if __name__ == "__main__":
    main()
