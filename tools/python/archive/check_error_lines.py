files_to_check = [
    ('scenarios/assetmanagement_beginner.js', 27),
    ('scenarios/audio_concurrency.js', 93),
    ('scenarios/lumen_mesh_distance.js', 55),
    ('scenarios/nanite_wpo.js', 43),
    ('scenarios/world_partition.js', 11)
]

for filepath, line_num in files_to_check:
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"\n{'='*60}")
    print(f"{filepath}:{line_num}")
    print('='*60)
    
    # Show the problematic line
    if line_num <= len(lines):
        line = lines[line_num - 1]
        print(f"Line {line_num}: {repr(line[:200])}")
        
        # Check for unusual characters
        for i, char in enumerate(line):
            if ord(char) > 127 and char not in ['\r', '\n']:
                print(f"  Position {i}: {repr(char)} (U+{ord(char):04X})")
