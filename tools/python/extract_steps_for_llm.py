"""
Script to extract step information for LLM-assisted choice generation.
Outputs step details in a format ready to paste into an LLM prompt.
"""

import re
import sys

def extract_step_details(filepath, step_id):
    """Extract complete step information for LLM prompt."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the step block - more flexible regex
    pattern = rf"'{step_id}':\s*{{\s*(.*?)\n\s*}}"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print(f"❌ Could not find step {step_id} in {filepath}")
        return None
    
    step_block = match.group(1)
    
    # Extract components
    skill_match = re.search(r"skill:\s*'([^']+)'", step_block)
    title_match = re.search(r"title:\s*'([^']+)'", step_block)
    prompt_match = re.search(r"prompt:\s*`([^`]+)`", step_block)
    
    skill = skill_match.group(1) if skill_match else 'unknown'
    title = title_match.group(1) if title_match else 'Unknown Title'
    prompt = prompt_match.group(1) if prompt_match else 'No prompt found'
    
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
        'prompt': prompt.strip(),
        'choices_text': choices_text,
        'choice_count': choice_count
    }

def format_for_llm(step_info, needed_count):
    """Format step information for LLM prompt."""
    output = f"""
{'='*80}
STEP: {step_info['step_id']}
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

**TASK:** Generate {needed_count} new choice(s) for this step.

**Suggested Types:**
- Consider what types are missing (correct, partial, misguided, wrong)
- Ensure variety in debugging approaches
- Maintain narrative consistency with existing choices

---
"""
    return output

# Main execution
if __name__ == "__main__":
    print("="*80)
    print("STEP EXTRACTION FOR LLM-ASSISTED CHOICE GENERATION")
    print("="*80)
    print()
    
    # List of steps that need work (from our analysis)
    steps_to_process = [
        ('scenarios/lumen_gi.js', 'step-1W', 2),
        ('scenarios/lumen_gi.js', 'step-1M', 3),
        ('scenarios/lumen_gi.js', 'step-2', 1),
        ('scenarios/lumen_gi.js', 'step-2W', 3),
        ('scenarios/lumen_gi.js', 'step-3', 2),
        # Add more as needed
    ]
    
    output_file = "docs/STEPS_FOR_LLM_GENERATION.md"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Steps Needing Additional Choices\n\n")
        f.write("This file contains step details extracted for LLM-assisted choice generation.\n")
        f.write("Copy each step block into your LLM prompt along with the template instructions.\n\n")
        
        for filepath, step_id, needed in steps_to_process:
            step_info = extract_step_details(filepath, step_id)
            if step_info:
                formatted = format_for_llm(step_info, needed)
                f.write(formatted)
                print(f"✅ Extracted {step_id} from {filepath}")
            else:
                print(f"❌ Failed to extract {step_id} from {filepath}")
    
    print(f"\n✅ Output written to: {output_file}")
    print("\nNext steps:")
    print("1. Review the generated file")
    print("2. Copy step blocks into your LLM prompt")
    print("3. Use the template from LLM_CHOICE_GENERATION_TEMPLATE.md")
    print("4. Paste generated choices back into the scenario files")
