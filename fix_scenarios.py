import os
import re
from pathlib import Path

def fix_scenario_syntax(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    
    # State tracking
    in_step = False
    in_choices = False
    step_indent = ""
    
    # Validation helpers
    def is_step_start(line):
        return re.match(r"\s*('step-[^']+'|'conclusion')\s*:\s*\{", line)

    for i, line in enumerate(lines):
        striped_line = line.strip()
        
        # 1. Fix Redundant Titles
        # Pattern: title: 'Step 14 / 29: The Static Dash' -> title: 'The Static Dash'
        if "title:" in line:
            # Regex to match "Step X / Y: " or "Step X: "
            title_clean = re.sub(r"(title:\s*['\"])Step \d+(?: \/ \d+)?: (.*['\"])", r"\1\2", line)
            if title_clean != line:
                print(f"  Fixed title in {line.strip()}")
                line = title_clean

        # 2. Fix Broken Nesting (The "Next: " missing value + missing closing braces)
        # Look for pattern where 'next:' is followed immediately by a new step start on the next lines
        # OR where a new step starts but we are deep inside the previous step structure
        
        # Detect if this line STARTS a new step
        if is_step_start(line):
            # If we were strictly following a "valid" file, we'd track depth.
            # But here we assume the indentation of the step keys is consistent (e.g. 8 spaces or 4 spaces)
            current_indent = re.match(r"(\s*)", line).group(1)
            
            # If this looks like a step start, check if the PREVIOUS line was a `next:` property that was empty
            if i > 0:
                prev_line = new_lines[-1]
                if "next:" in prev_line and ("'" not in prev_line and '"' not in prev_line):
                    # We found the syntax error pattern!
                    # "next:" is empty, and proper closings are missing.
                    
                    # Extract the step ID from the current line to use as the 'next' value
                    step_id_match = re.search(r"'([^']+)'", line)
                    if step_id_match:
                        next_step_id = step_id_match.group(1)
                        
                        # Fix the previous line
                        new_lines.pop() # Remove the incomplete "next:" line
                        
                        # We need to close the previous choice object, the choices array, and the previous step object
                        # This is a guess at the indentation, but standard formatting usually applies
                        # We assume the previous block was a choice.
                        
                        # Standard ending for a choice -> step transition:
                        # next: 'step-X'
                        # }
                        # ]
                        # },
                        
                        # Reconstruct:
                        fix_block = [
                            f"{current_indent}            next: '{next_step_id}'\n",
                            f"{current_indent}        }}\n", # Close choice
                            f"{current_indent}    ]\n",      # Close choices array
                            f"{current_indent}}},\n"         # Close step object
                        ]
                        
                        new_lines.extend(fix_block)
                        print(f"  Repaired broken nesting before {step_id_match.group(1)}")

        new_lines.append(line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

def main():
    scenarios_dir = Path("scenarios")
    if not scenarios_dir.exists():
        print("Scenarios directory not found.")
        return

    files = list(scenarios_dir.glob("*.js"))
    print(f"Scanning {len(files)} scenario files...")

    for file_path in files:
        # Skip known good/system files if any (optional)
        try:
            fix_scenario_syntax(file_path)
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    main()
