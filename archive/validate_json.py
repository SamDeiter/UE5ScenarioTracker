"""
JSON Validation Script for Screenshot Pipeline
Validates scenario JSON files for correct structure and image paths
"""
import json
import os
import sys

def validate_scenario_json(json_path):
    """Validate a scenario JSON file"""
    print(f"\n{'='*70}")
    print(f"Validating: {json_path}")
    print(f"{'='*70}\n")
    
    if not os.path.exists(json_path):
        print(f"❌ ERROR: File not found: {json_path}")
        return False
    
    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ ERROR: Invalid JSON - {e}")
        return False
    
    # Validate structure
    errors = []
    warnings = []
    
    # Check required fields
    if 'scenario_id' not in data:
        errors.append("Missing 'scenario_id' field")
    else:
        print(f"✓ Scenario ID: {data['scenario_id']}")
    
    if 'steps' not in data:
        errors.append("Missing 'steps' field")
    else:
        steps = data['steps']
        print(f"✓ Number of steps: {len(steps)}")
        
        # Validate each step
        for i, step in enumerate(steps, 1):
            print(f"\n  Step {i}:")
            
            # Check step fields
            if 'step_id' not in step:
                errors.append(f"  Step {i}: Missing 'step_id'")
            else:
                print(f"    ✓ Step ID: {step['step_id']}")
            
            if 'prompt' not in step:
                warnings.append(f"  Step {i}: Missing 'prompt'")
            else:
                print(f"    ✓ Prompt: {step['prompt'][:50]}...")
            
            if 'image_path' not in step:
                errors.append(f"  Step {i}: Missing 'image_path'")
            else:
                image_path = step['image_path']
                print(f"    ✓ Image path: {image_path}")
                
                # Check if image exists (relative to scenarios directory)
                base_dir = os.path.dirname(os.path.dirname(json_path))  # Go up to scenarios folder
                full_image_path = os.path.join(base_dir, image_path)
                
                if os.path.exists(full_image_path):
                    size_kb = os.path.getsize(full_image_path) / 1024
                    print(f"    ✓ Image file exists ({size_kb:.1f} KB)")
                else:
                    warnings.append(f"  Step {i}: Image file not found: {full_image_path}")
            
            if 'scene_data' not in step:
                warnings.append(f"  Step {i}: Missing 'scene_data'")
            else:
                print(f"    ✓ Scene data present")
    
    # Print summary
    print(f"\n{'='*70}")
    print("VALIDATION SUMMARY")
    print(f"{'='*70}")
    
    if errors:
        print(f"\n❌ ERRORS ({len(errors)}):")
        for error in errors:
            print(f"  - {error}")
    
    if warnings:
        print(f"\n⚠️  WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"  - {warning}")
    
    if not errors and not warnings:
        print("\n✅ ALL CHECKS PASSED!")
        return True
    elif not errors:
        print("\n✅ NO ERRORS (but some warnings)")
        return True
    else:
        print("\n❌ VALIDATION FAILED")
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python validate_json.py <path_to_scenario_json>")
        print("\nExample:")
        print("  python validate_json.py scenarios/directional_light/directional_light.js")
        sys.exit(1)
    
    json_path = sys.argv[1]
    
    # Handle .js files (extract JSON)
    if json_path.endswith('.js'):
        print(f"Note: Processing JavaScript file, extracting JSON...")
        with open(json_path, 'r') as f:
            content = f.read()
        # Extract JSON from window.SCENARIOS assignment
        import re
        match = re.search(r'=\s*({.*});', content, re.DOTALL)
        if match:
            temp_json_path = json_path.replace('.js', '_temp.json')
            with open(temp_json_path, 'w') as f:
                f.write(match.group(1))
            result = validate_scenario_json(temp_json_path)
            os.remove(temp_json_path)
        else:
            print("❌ ERROR: Could not extract JSON from .js file")
            result = False
    else:
        result = validate_scenario_json(json_path)
    
    sys.exit(0 if result else 1)
