"""
Generate expansion prompts for pilot scenarios
"""
import glob
import re
import os

PILOT_SCENARIOS = [
    'scenarios/volumetric_fog_banding.js',
    'scenarios/blueprint_infinite_loop.js',
    'scenarios/oversharpened_scene.js',
    'scenarios/terminal.js'
    # 'scenarios/generator.js' 
]

SYSTEM_PROMPT = """
You are the UE5 Scenario Logic Engine. 
Your task is to EXPAND this short troubleshooting scenario into a 10-12 step workflow.

INPUT SCENARIO:
{scenario_content}

INSTRUCTIONS:
1.  Analyze the existing "Correct Path" (Problem -> Analysis -> Fix).
2.  Generate NEW INTERMEDIATE STEPS to inject:
    -   PHASE 1 (Investigation): Add 2-3 steps BEFORE the fix where the user gathers info (View Modes, Logs, Profiler).
    -   PHASE 2 (Red Herring): Add 1 step where the user might get distracted by a common myth.
    -   PHASE 3 (Verification): Add 2 steps AFTER the fix to verify (Standalone mode, Performance check).
3.  Ensure the new steps link correctly to the existing flow.
    -   The last Investigation step should link to the start of the original Analysis/Fix.
    -   The original Fix should link to the first Verification step.

OUTPUT FORMAT:
Return ONLY a JSON object containing the NEW steps to be added. 
Do not return the existing steps.
Do not use "Action:" labels in choices.

Example Output Structure:
{
  "new_steps": {
     "step-investigation-1": { ... },
     "step-investigation-2": { ... },
     "step-verification-1": { ... }
  },
  "insert_instructions": [
     { "insert_before": "step-1", "step_id": "step-investigation-1" },
     { "insert_after": "step-3", "step_id": "step-verification-1" }
  ]
}
"""

for filepath in PILOT_SCENARIOS:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (not found)")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    prompt_content = SYSTEM_PROMPT.replace("{scenario_content}", content)
    
    output_path = f"prompts/{filename}.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(prompt_content)
        
    print(f"Generated prompt for {filename}")
