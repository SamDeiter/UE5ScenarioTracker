"""
Script to help generate additional choices for scenario steps.
Reads a step's context and generates plausible wrong answers.
"""

import json
import re

def extract_step_info(filepath, step_id):
    """Extract step information from a scenario file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the step block
    pattern = rf"'{step_id}':\s*{{(.*?)\n\s*}}(?:,|\s*}})"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        return None
    
    step_block = match.group(1)
    
    # Extract components
    skill = re.search(r"skill:\s*'([^']+)'", step_block)
    title = re.search(r"title:\s*'([^']+)'", step_block)
    prompt = re.search(r"prompt:\s*`([^`]+)`", step_block)
    
    # Extract existing choices
    choices_match = re.search(r"choices:\s*\[(.*?)\]", step_block, re.DOTALL)
    choices = []
    if choices_match:
        choices_block = choices_match.group(1)
        for choice_match in re.finditer(r"\{(.*?)\}", choices_block, re.DOTALL):
            choice_text = re.search(r"text:\s*['\"]([^'\"]+)['\"]", choice_match.group(1))
            choice_type = re.search(r"type:\s*'([^']+)'", choice_match.group(1))
            if choice_text and choice_type:
                choices.append({
                    'text': choice_text.group(1),
                    'type': choice_type.group(1)
                })
    
    return {
        'step_id': step_id,
        'skill': skill.group(1) if skill else '',
        'title': title.group(1) if title else '',
        'prompt': prompt.group(1) if prompt else '',
        'choices': choices
    }

def generate_choice_suggestions(step_info):
    """Generate suggestions for additional choices based on step context."""
    
    print(f"\n{'='*80}")
    print(f"STEP: {step_info['step_id']}")
    print(f"TITLE: {step_info['title']}")
    print(f"SKILL: {step_info['skill']}")
    print(f"{'='*80}")
    print(f"\nPROMPT:\n{step_info['prompt']}")
    print(f"\n{'='*80}")
    print(f"EXISTING CHOICES ({len(step_info['choices'])}):")
    print(f"{'='*80}")
    
    for i, choice in enumerate(step_info['choices'], 1):
        print(f"\n{i}. [{choice['type'].upper()}]")
        print(f"   {choice['text']}")
    
    needed = 4 - len(step_info['choices'])
    if needed > 0:
        print(f"\n{'='*80}")
        print(f"NEEDS {needed} MORE CHOICE(S)")
        print(f"{'='*80}")
        print("\nSuggested approach:")
        print("1. Read the prompt and existing choices")
        print("2. Think of plausible but incorrect debugging approaches")
        print("3. Consider common UE5 mistakes developers make")
        print("4. Add choices that maintain the narrative tone")
        print("\nChoice types to add:")
        
        existing_types = [c['type'] for c in step_info['choices']]
        if 'correct' not in existing_types:
            print("  - 'correct': The best solution")
        if 'partial' not in existing_types:
            print("  - 'partial': Works but not optimal")
        if 'misguided' not in existing_types:
            print("  - 'misguided': Plausible but wrong direction")
        if 'wrong' not in existing_types:
            print("  - 'wrong': Clearly incorrect approach")

# Example usage
if __name__ == "__main__":
    # Test with lumen_gi.js step-1W
    step_info = extract_step_info('scenarios/lumen_gi.js', 'step-1W')
    if step_info:
        generate_choice_suggestions(step_info)
    
    print("\n\n" + "="*80)
    print("TO USE THIS SCRIPT:")
    print("="*80)
    print("1. Edit the script to specify which step you want to work on")
    print("2. Run: python generate_choices_helper.py")
    print("3. Review the step context and existing choices")
    print("4. Manually add new choices to the scenario file")
    print("5. Test in the browser with debug mode enabled")
