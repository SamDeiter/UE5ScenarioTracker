import os
import re
import glob

def count_steps_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Simple regex to find step keys like 'step-1':, 'step-2':, etc.
            # This assumes standard formatting but should be good enough for a quick check.
            steps = re.findall(r"'step-\d+[A-Z]*'", content)
            # Filter out duplicates if any (though regex shouldn't find same key twice usually)
            unique_steps = set(steps)
            return len(unique_steps)
    except Exception as e:
        return 0

def main():
    scenario_dir = os.path.join(os.getcwd(), 'scenarios')
    files = glob.glob(os.path.join(scenario_dir, '*.js'))
    
    results = []
    for f in files:
        count = count_steps_in_file(f)
        filename = os.path.basename(f)
        results.append((filename, count))
    
    # Sort by count (ascending)
    results.sort(key=lambda x: x[1])
    
    print(f"{'Scenario File':<40} | {'Steps':<5}")
    print("-" * 48)
    for filename, count in results:
        print(f"{filename:<40} | {count:<5}")

if __name__ == "__main__":
    main()
