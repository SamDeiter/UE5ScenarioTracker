import os
import re
import json

# Resolve paths relative to this script file
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SCENARIOS_DIR = os.path.normpath(os.path.join(SCRIPT_DIR, "../../scenarios"))
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "needed_images.json")

def scan_scenarios():
    needed_images = []
    
    # Simple regex to capture the basic structure (not perfect JS parsing but sufficient for this specific schema)
    # We are looking for: 'step-id': { ... imagePrompt: "..." ... } entries
    
    for filename in os.listdir(SCENARIOS_DIR):
        if filename.endswith(".js"):
            filepath = os.path.join(SCENARIOS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Find all steps with imagePrompt
                # Regex looks for: 'step-key': { ... imagePrompt: "value"
                # This is a bit brittle with regex, but avoids needing a JS parser.
                # Assuming standard formatting as per the project style.
                
                # First, identifying step blocks is hard with regex. 
                # Let's just find all imagePrompt lines and try to infer context or just list them.
                
                # Better approach: Look for imagePrompt: "..." and extract it.
                matches = re.finditer(r'imagePrompt:\s*"(.*?)"', content)
                
                for match in matches:
                    prompt = match.group(1)
                    # We need to guess the step ID. It's usually the key before this block.
                    # Or we can just report the file and prompt.
                    
                    needed_images.append({
                        "file": filename,
                        "prompt": prompt,
                        "status": "pending_generation"
                    })
                    
    return needed_images

def main():
    print(f"Scanning {SCENARIOS_DIR} for image prompts...")
    images = scan_scenarios()
    
    print(f"Found {len(images)} pending image requests.")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(images, f, indent=4)
        
    print(f"Report saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
