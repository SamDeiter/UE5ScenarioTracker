import re

# Check the "General" area scenarios
general_files = [
    'dash.js',
    'generator.js', 
    'golem.js',
    'inventory.js',
    'oversharpened_scene.js',
    'terminal.js'
]

print("Current 'General' Area Scenarios:\n")

for filename in general_files:
    filepath = f'scenarios/{filename}'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title and description
    title_match = re.search(r'title:\s*["\']([^"\']+)["\']', content)
    desc_match = re.search(r'description:\s*["\']([^"\']+)["\']', content)
    
    title = title_match.group(1) if title_match else "No title"
    desc = desc_match.group(1) if desc_match else "No description"
    
    print(f"{filename}:")
    print(f"  Title: {title}")
    print(f"  Description: {desc[:100]}...")
    print()

# Suggest better tags
print("\n" + "="*60)
print("SUGGESTED AREA TAGS:")
print("="*60)
print("""
dash.js: 
  Current: General
  Suggested: Performance/Optimization
  Reason: Dash ability causing frame drops

generator.js:
  Current: General  
  Suggested: Procedural Generation
  Reason: Procedural content generation

golem.js:
  Current: General
  Suggested: AI/Gameplay
  Reason: Enemy AI behavior

inventory.js:
  Current: General
  Suggested: UI/Systems
  Reason: Inventory system implementation

oversharpened_scene.js:
  Current: General
  Suggested: Post-Processing
  Reason: Post-process sharpening issue

terminal.js:
  Current: General
  Suggested: UI/UX
  Reason: Terminal UI implementation
""")
