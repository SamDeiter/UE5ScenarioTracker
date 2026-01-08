import os
import re

def audit_capture_decoupling():
    scenarios_dir = os.path.join(os.getcwd(), "scenarios")
    forbidden_pattern = re.compile(r'action:\s*["\'](capture_screenshot|take_photo|start_recording|capture)["\']', re.IGNORECASE)
    
    violations = []
    
    print(f"--- Auditing Capture Decoupling in {scenarios_dir} ---")
    
    for root, dirs, files in os.walk(scenarios_dir):
        for f in files:
            if f.endswith(".js"):
                path = os.path.join(root, f)
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()
                    if forbidden_pattern.search(content):
                        violations.append(f)

    if violations:
        print("❌ DECOUPLING FAILURE: Direct capture actions found in scenarios!")
        for v in violations:
            print(f"  - {v}")
        return False
    else:
        print("✅ DECOUPLING PASSED: No direct capture actions found in scenarios. Capture is centralized.")
        return True

if __name__ == "__main__":
    audit_capture_decoupling()
