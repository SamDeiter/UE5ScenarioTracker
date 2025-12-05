"""
Quick Start: Test the Scenario Generator
Run this to verify everything works!
"""

import os
import sys
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed"""
    print("🔍 Checking dependencies...")
    
    try:
        import google.generativeai as genai
        print("  ✅ google-generativeai installed")
        return True
    except ImportError:
        print("  ❌ google-generativeai NOT installed")
        print("\n📦 Install with: pip install google-generativeai")
        return False

def check_api_key():
    """Check if API key is set"""
    print("\n🔑 Checking API key...")
    
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        print(f"  ✅ GEMINI_API_KEY is set ({api_key[:8]}...)")
        return api_key
    else:
        print("  ❌ GEMINI_API_KEY not set")
        print("\n🔧 Set it with:")
        print("  PowerShell: $env:GEMINI_API_KEY = 'your-key-here'")
        print("  CMD: set GEMINI_API_KEY=your-key-here")
        print("\n🌐 Get your key from: https://makersuite.google.com/app/apikey")
        return None

def check_files():
    """Check if required files exist"""
    print("\n📁 Checking files...")
    
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    
    files_to_check = [
        ('raw_data.json', project_root / 'raw_data.json'),
        ('scenario_generator.py', script_dir / 'scenario_generator.py'),
        ('templates', project_root / 'tools' / 'templates' / 'scenario_templates.json')
    ]
    
    all_exist = True
    for name, path in files_to_check:
        if path.exists():
            print(f"  ✅ {name} found")
        else:
            print(f"  ❌ {name} NOT found at {path}")
            all_exist = False
    
    return all_exist

def run_test(api_key):
    """Run a test generation"""
    print("\n🚀 Running test generation...")
    print("=" * 60)
    
    from scenario_generator import ScenarioGenerator
    import json
    
    # Load first scenario
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    raw_data_path = project_root / 'raw_data.json'
    
    with open(raw_data_path, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    if not raw_data:
        print("❌ No scenarios found in raw_data.json")
        return False
    
    # Generate first scenario
    raw_scenario = raw_data[0]
    print(f"\n📝 Testing with: {raw_scenario['scenario']['title']}")
    
    generator = ScenarioGenerator(api_key)
    
    try:
        scenario = generator.generate_full_scenario(raw_scenario)
        
        if generator.validate_scenario(scenario):
            print("\n✅ TEST PASSED!")
            print(f"📊 Tokens used: ~{generator.token_count}")
            
            # Estimate cost
            cost = (generator.token_count / 1_000_000) * 0.1875
            print(f"💰 Estimated cost: ${cost:.6f}")
            
            # Ask if user wants to save
            print("\n💾 Save this scenario?")
            response = input("  (y/n): ").strip().lower()
            
            if response == 'y':
                output_path = project_root / 'scenarios' / f"{raw_scenario['scenario']['scenario_id']}.js"
                generator.save_scenario_js(scenario, output_path)
                print(f"✅ Saved to: {output_path}")
            
            return True
        else:
            print("\n❌ TEST FAILED: Validation errors")
            return False
    
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main quick start function"""
    print("=" * 60)
    print("🎯 SCENARIO GENERATOR - QUICK START TEST")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        return 1
    
    # Check API key
    api_key = check_api_key()
    if not api_key:
        return 1
    
    # Check files
    if not check_files():
        return 1
    
    # Run test
    print("\n" + "=" * 60)
    print("✅ All checks passed! Ready to test.")
    print("=" * 60)
    
    response = input("\n🚀 Run test generation? (y/n): ").strip().lower()
    if response == 'y':
        success = run_test(api_key)
        return 0 if success else 1
    else:
        print("\n👋 Skipped test. Run this script again when ready!")
        return 0

if __name__ == '__main__':
    sys.exit(main())
