import glob

# Find all JavaScript files in scenarios folder  
js_files = glob.glob('scenarios/*.js')

# Look for different types of smart quotes
smart_quote_chars = [
    ('\u2018', 'LEFT SINGLE QUOTATION MARK'),
    ('\u2019', 'RIGHT SINGLE QUOTATION MARK'),  
    ('\u201C', 'LEFT DOUBLE QUOTATION MARK'),
    ('\u201D', 'RIGHT DOUBLE QUOTATION MARK'),
    ('\u201A', 'SINGLE LOW-9 QUOTATION MARK'),
    ('\u201E', 'DOUBLE LOW-9 QUOTATION MARK'),
]

total_found = 0

for filepath in js_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found_in_file = False
        for char, name in smart_quote_chars:
            count = content.count(char)
            if count > 0:
                if not found_in_file:
                    print(f"\n{filepath}:")
                    found_in_file = True
                print(f"  {name} ({repr(char)}): {count}")
                total_found += count
                
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print(f"\n\nTotal smart quotes found: {total_found}")

if total_found > 0:
    print("\nFixing all smart quotes now...")
    for filepath in js_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace all types of smart quotes
            content = content.replace('\u2018', "'")  # Left single quote
            content = content.replace('\u2019', "'")  # Right single quote
            content = content.replace('\u201C', '"')  # Left double quote
            content = content.replace('\u201D', '"')  # Right double quote
            content = content.replace('\u201A', "'")  # Single low-9 quote
            content = content.replace('\u201E', '"')  # Double low-9 quote
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        except Exception as e:
            print(f"Error fixing {filepath}: {e}")
    
    print("Done!")
else:
    print("\nNo smart quotes found!")
