"""
Extract ALL remaining steps that need choices for LLM generation.
"""

import re

def extract_step_details(filepath, step_id):
    """Extract complete step information for LLM prompt."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the step block
    pattern = rf"'{step_id}':\s*{{\s*(.*?)\n\s*}}(?:,|\s*}})"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        return None
    
    step_block = match.group(1)
    
    # Extract components
    skill_match = re.search(r"skill:\s*'([^']+)'", step_block)
    title_match = re.search(r"title:\s*'([^']+)'", step_block)
    prompt_match = re.search(r"prompt:\s*`([^`]+)`", step_block)
    
    skill = skill_match.group(1) if skill_match else 'unknown'
    title = title_match.group(1) if title_match else 'Unknown Title'
    prompt = prompt_match.group(1).strip() if prompt_match else 'No prompt found'
    
    # Extract choices
    choices_match = re.search(r"choices:\s*\[(.*?)\]", step_block, re.DOTALL)
    choices_text = "No existing choices found"
    choice_count = 0
    
    if choices_match:
        choices_block = choices_match.group(1)
        choice_count = len(re.findall(r'\{\s*text:', choices_block))
        choices_text = choices_block.strip()
    
    return {
        'step_id': step_id,
        'skill': skill,
        'title': title,
        'prompt': prompt,
        'choices_text': choices_text,
        'choice_count': choice_count
    }

def format_for_llm(step_info, needed_count, scenario_name):
    """Format step information for LLM prompt."""
    output = f"""
{'='*80}
{scenario_name.upper()} - STEP: {step_info['step_id']}
{'='*80}

**Title:** {step_info['title']}
**Skill:** {step_info['skill']}
**Current Choices:** {step_info['choice_count']}
**Needs:** {needed_count} more choice(s)

**Prompt:**
```
{step_info['prompt']}
```

**Existing Choices:**
```javascript
{step_info['choices_text']}
```

**GENERATE {needed_count} NEW CHOICE(S) HERE:**

---
"""
    return output

# All steps that need work
lumen_gi_steps = [
    ('step-3W', 3),
    ('step-4', 1),
    ('step-4M', 3),
    ('step-5', 2),
    ('step-5W', 3),
    ('step-6', 2),
    ('step-6M', 3),
    ('step-7', 2),
    ('step-8', 2),
    ('step-8W', 3),
    ('step-9', 2),
]

blueprints_steps = [
    ('step-1W', 2),
    ('step-1M', 3),
    ('step-2', 1),
    ('step-2W', 3),
    ('step-3', 1),
    ('step-3W', 3),
    ('step-3M', 3),
    ('step-4', 1),
    ('step-4W', 3),
    ('step-5', 2),
    ('step-5W', 3),
    ('step-6', 2),
    ('step-6W', 3),
    ('step-7', 2),
]

output_file = "docs/ALL_STEPS_FOR_LLM_GENERATION.md"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("# ALL Steps Needing Additional Choices\n\n")
    f.write("This file contains ALL step details for LLM-assisted choice generation.\n")
    f.write("Use this with the template from `LLM_CHOICE_GENERATION_TEMPLATE.md`\n\n")
    f.write(f"**Total Steps:** {len(lumen_gi_steps) + len(blueprints_steps)}\n")
    f.write(f"**Total New Choices Needed:** ~{sum(n for _, n in lumen_gi_steps) + sum(n for _, n in blueprints_steps)}\n\n")
    f.write("---\n\n")
    
    # Process lumen_gi.js
    f.write("# LUMEN_GI.JS - 11 Steps Remaining\n\n")
    for step_id, needed in lumen_gi_steps:
        step_info = extract_step_details('scenarios/lumen_gi.js', step_id)
        if step_info:
            formatted = format_for_llm(step_info, needed, 'lumen_gi.js')
            f.write(formatted)
            print(f"✅ Extracted {step_id} from lumen_gi.js (needs {needed})")
    
    # Process blueprintslogic_advanced.js
    f.write("\n\n# BLUEPRINTSLOGIC_ADVANCED.JS - 14 Steps Remaining\n\n")
    for step_id, needed in blueprints_steps:
        step_info = extract_step_details('scenarios/blueprintslogic_advanced.js', step_id)
        if step_info:
            formatted = format_for_llm(step_info, needed, 'blueprintslogic_advanced.js')
            f.write(formatted)
            print(f"✅ Extracted {step_id} from blueprintslogic_advanced.js (needs {needed})")

print(f"\n{'='*80}")
print(f"✅ Output written to: {output_file}")
print(f"{'='*80}")
print(f"\nTotal steps extracted: {len(lumen_gi_steps) + len(blueprints_steps)}")
print(f"Total new choices needed: ~{sum(n for _, n in lumen_gi_steps) + sum(n for _, n in blueprints_steps)}")
print("\nNext steps:")
print("1. Copy the template from LLM_CHOICE_GENERATION_TEMPLATE.md")
print("2. Feed steps from ALL_STEPS_FOR_LLM_GENERATION.md to your LLM")
print("3. Collect all generated choices")
print("4. Run merge script to integrate them")
