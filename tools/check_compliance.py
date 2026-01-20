import os
import sys

def check_no_cpp_compliance():
    forbidden_extensions = {".cpp", ".h", ".cs", ".sln", ".vcxproj"}
    forbidden_dirs = {"Source", "Binaries", "Intermediate"}
    
    root_dir = os.getcwd()
    violations = []

    print(f"--- Running No-C++ Compliance Audit in {root_dir} ---")

    for root, dirs, files in os.walk(root_dir):
        # Check for forbidden directories
        for d in dirs:
            if d in forbidden_dirs:
                violations.append(f"Forbidden Directory: {os.path.join(root, d)}")
        
        # Check for forbidden file extensions
        for f in files:
            _, ext = os.path.splitext(f)
            if ext.lower() in forbidden_extensions:
                violations.append(f"Forbidden File: {os.path.join(root, f)}")

    if violations:
        print("❌ COMPLIANCE FAILURE: C++ elements detected!")
        for v in violations:
            print(f"  - {v}")
        sys.exit(1)
    else:
        print("✅ COMPLIANCE PASSED: No C++ elements found. System is strictly Blueprint + Python.")
        sys.exit(0)

if __name__ == "__main__":
    check_no_cpp_compliance()
