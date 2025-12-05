"""
Remove exposed API key from git history using git filter-repo
"""
import subprocess
import sys
import tempfile
import os

def main():
    # Create a temporary file with the replacement text
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
        # Format: literal_string==>replacement
        f.write('AIzaSyC59PARBWDimiKKCmvjHA_S3ZHuXXm71_M==>your-api-key-here\n')
        temp_file = f.name
    
    try:
        print(f"Created replacement file: {temp_file}")
        
        # Run git filter-repo
        cmd = [
            'git', 'filter-repo',
            '--replace-text', temp_file,
            '--force'
        ]
        
        print(f"Running: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr, file=sys.stderr)
        
        if result.returncode == 0:
            print("\n✅ Successfully removed API key from git history!")
            print("\n⚠️  NEXT STEPS:")
            print("1. Verify the key is gone: git log --all -S 'AIzaSy' --oneline")
            print("2. Force push to GitHub: git push origin --force --all")
            print("3. Force push tags: git push origin --force --tags")
        else:
            print(f"\n❌ Command failed with exit code {result.returncode}")
            
    finally:
        # Clean up temp file
        if os.path.exists(temp_file):
            os.remove(temp_file)
            print(f"Cleaned up: {temp_file}")

if __name__ == '__main__':
    main()
