"""
Remove hard-coded colors from generator UI style.css and replace with CSS variables.
"""

import re

print("🔧 Centralizing colors in generator UI...\n")

with open('tools/generator_ui/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new CSS variables for colors that are currently hard-coded
additional_vars = """
    --accent-green-light: #56d364;
    --divider-gray: #71717a;
    --btn-blue-hover: #79b8ff;
    
    /* Category badge colors */
    --category-lighting: #ffc107;
    --category-blueprints: #4dabff;
    --category-materials: #ce93d8;
    --category-world: #81c784;
    --category-physics: #ef5350;
    --category-asset: #4dd0e1;
    --category-sequencer: #f48fb1;
    --category-audio: #ff8a65;
    --category-performance: #aed581;
    
    /* Form/Button colors */
    --form-primary: #2980b9;
    --form-success: #27ae60;
    --form-warning: #f39c12;
    --form-warning-light: #f1c40f;"""

# Find the end of :root section and insert new variables
root_end = content.find('    --shadow:')
if root_end != -1:
    # Find the end of the shadow line
    shadow_end = content.find(';', root_end) + 1
    content = content[:shadow_end] + '\n' + additional_vars + content[shadow_end:]
    print("✓ Added additional CSS variables")

# Now replace hard-coded colors with variables
replacements = [
    # Gradient accents
    (r'#56d364', 'var(--accent-green-light)'),
    (r'#71717a', 'var(--divider-gray)'),
    (r'#79b8ff', 'var(--btn-blue-hover)'),
    
    # Category colors
    (r'#ffc107', 'var(--category-lighting)'),
    (r'#4dabff', 'var(--category-blueprints)'),
    (r'#ce93d8', 'var(--category-materials)'),
    (r'#81c784', 'var(--category-world)'),
    (r'#ef5350', 'var(--category-physics)'),
    (r'#4dd0e1', 'var(--category-asset)'),
    (r'#f48fb1', 'var(--category-sequencer)'),
    (r'#ff8a65', 'var(--category-audio)'),
    (r'#aed581', 'var(--category-performance)'),
    
    # Form colors
    (r'#2980b9', 'var(--form-primary)'),
    (r'#27ae60', 'var(--form-success)'),
    (r'#f39c12', 'var(--form-warning)'),
    (r'#f1c40f', 'var(--form-warning-light)'),
]

count = 0
# Only replace hex values that are NOT inside :root {}
# Split content into :root section and rest
root_start = content.find(':root {')
root_block_end = content.find('}', root_start) + 1

before_root = content[:root_start]
root_block = content[root_start:root_block_end]
after_root = content[root_block_end:]

# Apply replacements only to the after_root section
for pattern, replacement in replacements:
    matches = len(re.findall(pattern, after_root))
    after_root = re.sub(pattern, replacement, after_root)
    count += matches

# Reconstruct
content = before_root + root_block + after_root

print(f"✓ Replaced {count} hard-coded color values with CSS variables")

with open('tools/generator_ui/style.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Generator UI colors centralized!")
print("All hard-coded colors now use CSS custom properties.")
