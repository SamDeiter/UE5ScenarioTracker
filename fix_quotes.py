import glob
import os

# Find all JavaScript files in scenarios folder
js_files = glob.glob('scenarios/*.js')

total_replacements = 0

for filepath in js_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count smart quotes before replacement
        count_before = content.count('\u2018') + content.count('\u2019')
        
        #Replace smart quotes with straight quotes
        content = content.replace('\u2018', "'")  # Left single quote
        content = content.replace('\u2019', "'")  # Right single quote
        
        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        if count_before > 0:
            print(f"Fixed {filepath}: {count_before} smart quotes replaced")
            total_replacements += count_before
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print(f"\nTotal files processed: {len(js_files)}")
print(f"Total smart quotes fixed: {total_replacements}")
