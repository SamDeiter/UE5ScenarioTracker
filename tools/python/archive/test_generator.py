"""
Simple test script for the scenario generator with better error handling
"""
import os
import sys

def check_dependencies():
    """Check if required packages are installed"""
    print("🔍 Checking dependencies...")
    
    try:
        import google.generativeai as genai
        print("✅ google-generativeai is installed")
        return True
    except ImportError:
        print("❌ google-generativeai is NOT installed")
        print("\n📦 To install, run:")
        print("   pip install google-generativeai")
        return False

def check_api_key():
    """Check if API key is set"""
    print("\n🔍 Checking API key...")
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable is NOT set")
        print("\n🔑 To set your API key:")
        print("   PowerShell: $env:GEMINI_API_KEY = \"your-key-here\"")
        print("   CMD: set GEMINI_API_KEY=your-key-here")
        return None
    
    # Mask most of the key for security
    masked = api_key[:10] + "..." + api_key[-4:]
    print(f"✅ API key found: {masked}")
    return api_key

def test_api_connection(api_key):
    """Test if we can connect to the API"""
    print("\n🔍 Testing API connection...")
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        # Try to list models
        import requests
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
        resp = requests.get(url, timeout=10)
        
        if resp.status_code == 200:
            data = resp.json()
            models = [m['name'] for m in data.get('models', [])]
            print(f"✅ API connection successful! Found {len(models)} models")
            print(f"   Available models: {', '.join(models[:3])}...")
            return True
        elif resp.status_code == 400:
            print("❌ API key is invalid (400 error)")
            print("   Please check your API key at: https://makersuite.google.com/app/apikey")
            return False
        else:
            print(f"⚠️ API returned status code: {resp.status_code}")
            print(f"   Response: {resp.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False

def run_generator():
    """Try to run the actual generator"""
    print("\n🚀 Running scenario generator...")
    
    try:
        from scenario_generator import main
        main()
        return True
    except Exception as e:
        print(f"❌ Error running generator: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 80)
    print("🧪 UE5 Scenario Generator Test")
    print("=" * 80)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Step 2: Check API key
    api_key = check_api_key()
    if not api_key:
        sys.exit(1)
    
    # Step 3: Test API connection
    if not test_api_connection(api_key):
        sys.exit(1)
    
    # Step 4: Run the generator
    print("\n" + "=" * 80)
    if run_generator():
        print("\n✨ All tests passed!")
    else:
        print("\n❌ Generator failed. Check errors above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
