"""
Scan all scenario files and list unique categories
"""
import glob
import re

cats = {}
for f in glob.glob('scenarios/*.js'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        match = re.search(r'category:\s*"([^"]+)"', content)
        if match:
            cat = match.group(1)
            if cat not in cats:
                cats[cat] = []
            cats[cat].append(f)

print("="*80)
print("ALL UNIQUE CATEGORIES")
print("="*80)
for cat in sorted(cats.keys()):
    print(f"\n'{cat}' - used in {len(cats[cat])} file(s)")
    
print("\n" + "="*80)
print("PROBLEMATIC CATEGORIES (with spaces, slashes, or hyphens)")
print("="*80)
for cat in sorted(cats.keys()):
    if ' ' in cat or '/' in cat or '-' in cat:
        print(f"  '{cat}' → needs fixing")
