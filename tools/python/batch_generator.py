"""
Batch convert scenarios from raw_data.json using the Gemini API.
Generates 5 scenarios at a time with rate limiting.
"""
import json
import time
from pathlib import Path
from scenario_generator import ScenarioGenerator
from env_loader import get_gemini_key


def batch_generate(count=5, skip_existing=True):
    """
    Generate multiple scenarios from raw_data.json
    
    Args:
        count: Number of scenarios to generate
        skip_existing: Skip scenarios that already have .js files
    """
    # Load API key securely
    try:
        api_key = get_gemini_key()
        print(f"✅ API key loaded: {api_key[:8]}...")
    except ValueError as e:
        print(f"❌ Error: {e}")
        return
    
    # Initialize generator
    generator = ScenarioGenerator(api_key)
    
    # Load raw data
    raw_data_path = Path(__file__).parent.parent.parent / 'raw_data.json'
    scenarios_dir = Path(__file__).parent.parent.parent / 'scenarios'
    
    with open(raw_data_path, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    print(f"\n📦 Found {len(raw_data)} scenarios in raw_data.json")
    
    # Filter scenarios
    to_generate = []
    for raw_scenario in raw_data:
        scenario_id = raw_scenario['scenario']['scenario_id']
        output_path = scenarios_dir / f"{scenario_id}.js"
        
        if skip_existing and output_path.exists():
            print(f"⏭️  Skipping {scenario_id} (already exists)")
            continue
        
        to_generate.append(raw_scenario)
        
        if len(to_generate) >= count:
            break
    
    if not to_generate:
        print("✨ All scenarios already generated!")
        return
    
    print(f"\n🚀 Generating {len(to_generate)} scenarios...")
    print("=" * 80)
    
    # Generate each scenario with rate limiting
    successful = 0
    failed = 0
    
    for i, raw_scenario in enumerate(to_generate, 1):
        scenario_id = raw_scenario['scenario']['scenario_id']
        print(f"\n[{i}/{len(to_generate)}] Processing: {scenario_id}")
        
        try:
            # Generate scenario
            scenario = generator.generate_full_scenario(raw_scenario)
            
            # Validate
            if generator.validate_scenario(scenario):
                # Save
                output_path = scenarios_dir / f"{scenario_id}.js"
                generator.save_scenario_js(scenario, output_path)
                successful += 1
                print(f"✅ Successfully generated: {scenario_id}")
            else:
                failed += 1
                print(f"❌ Validation failed: {scenario_id}")
                
        except Exception as e:
            failed += 1
            print(f"❌ Error generating {scenario_id}: {e}")
        
        # Rate limiting: wait between requests (Gemini free tier: 15 RPM)
        if i < len(to_generate):
            wait_time = 5  # 5 seconds between scenarios
            print(f"⏳ Waiting {wait_time}s before next scenario...")
            time.sleep(wait_time)
    
    # Summary
    print("\n" + "=" * 80)
    print(f"📊 BATCH GENERATION COMPLETE")
    print(f"   ✅ Successful: {successful}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📊 Total tokens used: ~{generator.token_count}")
    print(f"   💰 Estimated cost: ${generator.token_count * 0.0000002:.4f}")


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Batch generate scenarios')
    parser.add_argument('--count', type=int, default=5, help='Number of scenarios to generate')
    parser.add_argument('--force', action='store_true', help='Regenerate existing scenarios')
    
    args = parser.parse_args()
    
    batch_generate(count=args.count, skip_existing=not args.force)
