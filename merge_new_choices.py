"""
Script to add the LLM-generated choices to lumen_gi.js
"""

import re

# Read the current file
with open('scenarios/lumen_gi.js', 'r', encoding='utf-8') as f:
    content = f.read()

# New choices to add
new_choices = {
    'step-1W': [
        {
            'text': "Raise the Sky Light intensity to overpower the dark areas",
            'type': 'wrong',
            'feedback': "You max out the Sky Light, but the shadows turn flat and the entire level takes on a washed-out haze. Nothing about the GI actually improves—you're simply flooding the scene with ambient light. After wasting time readjusting exposure, you realize you're masking the real issue instead of solving it.",
            'next': 'step-1W'
        },
        {
            'text': "Reset all Post Process exposure settings to defaults and re-evaluate the scene",
            'type': 'partial',
            'feedback': "Bringing exposure back to defaults at least removes some of the compensatory tweaks that were hiding important clues. The level still appears dim in indirect regions, but now you can more clearly see that Lumen itself isn't behaving as expected. This pushes you to revisit earlier assumptions.",
            'next': 'step-1'
        }
    ],
    'step-1M': [
        {
            'text': "Add a series of small point lights to fill in dark corners manually",
            'type': 'misguided',
            'feedback': "You pepper the scene with tiny point lights, but the result is patchy and inconsistent. Your teammate walks by and immediately asks why the shadows look 'stage-lit.' The problem isn't lack of lights—it's the GI system not contributing properly.",
            'next': 'step-1M'
        },
        {
            'text': "Increase the indirect lighting intensity on each key light",
            'type': 'partial',
            'feedback': "The scene brightens a little, but the bounce still feels unnatural and uneven. You're essentially trying to brute-force indirect light, which never looks as cohesive as true Lumen GI. Still, the experiment confirms that your direct lights are not the issue.",
            'next': 'step-1'
        },
        {
            'text': "Disable all fill lights you've added and check the Lumen visualizer",
            'type': 'correct',
            'feedback': "Once the clutter of manual lights is gone, the Lumen visualizer makes the underlying issue obvious—your GI contribution is extremely low in several zones. This is the first real signal pointing you back toward systemic settings rather than ad-hoc lighting fixes.",
            'next': 'step-2'
        }
    ],
    'step-2': [
        {
            'text': "Verify that Lumen Global Illumination is enabled instead of Screen Space GI",
            'type': 'correct',
            'feedback': "You open the Project Settings and realize the project is still using SSAO-based GI rather than Lumen. Switching to Lumen immediately gives the scene the indirect bounce it was missing. The improvement is noticeable, and you've found a legitimate root cause.",
            'next': 'step-3'
        }
    ],
    'step-2W': [
        {
            'text': "Attempt to rebuild lighting hoping it will force Lumen to update",
            'type': 'wrong',
            'feedback': "You spend several minutes waiting on a light build only to remember—again—that Lumen doesn't use baked lighting at all. The results are unchanged, and your tech lead laughs as they walk by, reminding you that you're chasing ghosts.",
            'next': 'step-2W'
        },
        {
            'text': "Switch the rendering engine back and forth between Deferred and Forward hoping for a refresh",
            'type': 'misguided',
            'feedback': "Switching pipelines forces a bunch of shader recompiles but does nothing to fix the underlying GI mismatch. The scene looks slightly different due to tonemapping shifts, but Lumen still isn't engaged. At least you confirm the problem isn't tied to the renderer type.",
            'next': 'step-2W'
        },
        {
            'text': "Double-check the Project Template to confirm whether it shipped with Lumen disabled by default",
            'type': 'partial',
            'feedback': "You inspect the template settings and discover that some starter templates—especially performance-oriented ones—disable Lumen to target lower-end hardware. This doesn't fix anything yet, but it nudges you toward verifying the higher-level Lumen settings directly.",
            'next': 'step-2'
        }
    ],
    'step-3': [
        {
            'text': "Enable Hardware Ray Tracing support to let Lumen run in its full-quality mode",
            'type': 'partial',
            'feedback': "Turning on hardware ray tracing does improve some aspects of Lumen, but it also triggers long shader recompiles. The GI becomes slightly more stable, but the core issue isn't resolved yet. You realize you still need to verify Lumen's GI settings directly.",
            'next': 'step-3'
        },
        {
            'text': "Switch Global Illumination and Reflections to Lumen in the Rendering settings",
            'type': 'correct',
            'feedback': "In Project Settings you explicitly set both Global Illumination and Reflections to Lumen. After restarting the editor as prompted, the level immediately shows richer bounce light and more accurate reflections. You've correctly enabled the intended GI system and are ready to fine-tune quality.",
            'next': 'conclusion'
        }
    ]
}

def format_choice(choice):
    """Format a choice object as JavaScript code."""
    return f"""                {{
                    text: "{choice['text']}",
                    type: '{choice['type']}',
                    feedback: "{choice['feedback']}",
                    next: '{choice['next']}'
                }}"""

# Function to add choices to a step
def add_choices_to_step(content, step_id, new_choices_list):
    """Add new choices to an existing step's choices array."""
    
    # Find the step's choices array
    pattern = rf"('{step_id}':\s*{{.*?choices:\s*\[)(.*?)(\])"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print(f"❌ Could not find step {step_id}")
        return content
    
    before = match.group(1)
    existing_choices = match.group(2).strip()
    after = match.group(3)
    
    # Format new choices
    formatted_new_choices = [format_choice(choice) for choice in new_choices_list]
    
    # Combine existing and new choices
    if existing_choices:
        # Add comma after existing choices
        all_choices = existing_choices.rstrip() + ',\n' + ',\n'.join(formatted_new_choices)
    else:
        all_choices = '\n'.join(formatted_new_choices)
    
    # Reconstruct the step
    new_step = before + '\n' + all_choices + '\n            ' + after
    
    # Replace in content
    new_content = content[:match.start()] + new_step + content[match.end():]
    
    print(f"✅ Added {len(new_choices_list)} choice(s) to {step_id}")
    return new_content

# Add all new choices
for step_id, choices in new_choices.items():
    content = add_choices_to_step(content, step_id, choices)

# Write back to file
with open('scenarios/lumen_gi.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Successfully updated lumen_gi.js with new choices!")
print("\nNext steps:")
print("1. Review the file to ensure formatting is correct")
print("2. Test in the browser with debug mode enabled")
print("3. Verify all choices work as expected")
