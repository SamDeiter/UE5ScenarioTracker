"""
Convert BMP screenshots to PNG format for better browser support.
Also updates scenario files to reference the new PNG files.
"""

import os
import re
from pathlib import Path
from PIL import Image

def convert_bmp_to_png(scenarios_dir):
    """Convert all BMP files in scenario image directories to PNG."""
    
    converted = []
    scenarios_path = Path(scenarios_dir)
    
    # Find all BMP files in scenario subdirectories
    for bmp_file in scenarios_path.rglob("*.bmp"):
        png_file = bmp_file.with_suffix(".png")
        
        try:
            # Load and save as PNG
            img = Image.open(bmp_file)
            img.save(png_file, "PNG", optimize=True)
            
            # Get size comparison
            bmp_size = os.path.getsize(bmp_file)
            png_size = os.path.getsize(png_file)
            savings_pct = (1 - png_size / bmp_size) * 100
            
            print(f"✅ Converted: {bmp_file.name} -> {png_file.name}")
            print(f"   Size: {bmp_size/1024:.0f}KB -> {png_size/1024:.0f}KB ({savings_pct:.1f}% smaller)")
            
            converted.append({
                "bmp": str(bmp_file),
                "png": str(png_file),
                "bmp_size": bmp_size,
                "png_size": png_size
            })
            
        except Exception as e:
            print(f"❌ Failed to convert {bmp_file}: {e}")
    
    return converted


def update_scenario_files(scenarios_dir):
    """Update .js scenario files to reference PNG instead of BMP."""
    
    scenarios_path = Path(scenarios_dir)
    updated_files = []
    
    for js_file in scenarios_path.glob("*.js"):
        content = js_file.read_text(encoding='utf-8')
        
        # Replace .bmp references with .png
        new_content = content.replace('.bmp"', '.png"')
        
        if new_content != content:
            js_file.write_text(new_content, encoding='utf-8')
            print(f"📝 Updated references in: {js_file.name}")
            updated_files.append(str(js_file))
    
    # Also update nested scenario folders with .js files
    for subdir in scenarios_path.iterdir():
        if subdir.is_dir():
            for js_file in subdir.glob("*.js"):
                content = js_file.read_text(encoding='utf-8')
                new_content = content.replace('.bmp"', '.png"')
                
                if new_content != content:
                    js_file.write_text(new_content, encoding='utf-8')
                    print(f"📝 Updated references in: {subdir.name}/{js_file.name}")
                    updated_files.append(str(js_file))
    
    return updated_files


def cleanup_bmp_files(converted_list, keep_backups=False):
    """Optionally delete BMP files after conversion."""
    
    for item in converted_list:
        bmp_path = Path(item["bmp"])
        if bmp_path.exists():
            if keep_backups:
                backup_path = bmp_path.with_suffix(".bmp.backup")
                bmp_path.rename(backup_path)
                print(f"📦 Backed up: {bmp_path.name} -> {backup_path.name}")
            else:
                bmp_path.unlink()
                print(f"🗑️ Deleted: {bmp_path.name}")


if __name__ == "__main__":
    import sys
    
    # Default to scenarios directory relative to repo root
    repo_root = Path(__file__).parent.parent
    scenarios_dir = repo_root / "scenarios"
    
    print("=" * 60)
    print("BMP to PNG Converter for Scenario Screenshots")
    print("=" * 60)
    print()
    
    # Step 1: Convert BMP to PNG
    print("Step 1: Converting images...")
    print("-" * 40)
    converted = convert_bmp_to_png(scenarios_dir)
    print()
    
    if not converted:
        print("No BMP files found to convert.")
        sys.exit(0)
    
    # Step 2: Update scenario JS files
    print("Step 2: Updating scenario files...")
    print("-" * 40)
    updated = update_scenario_files(scenarios_dir)
    print()
    
    # Step 3: Cleanup (delete BMP files since PNG is working)
    print("Step 3: Cleaning up BMP files...")
    print("-" * 40)
    cleanup_bmp_files(converted, keep_backups=False)
    print()
    
    # Summary
    print("=" * 60)
    print("CONVERSION COMPLETE")
    print("=" * 60)
    print(f"  Images converted: {len(converted)}")
    print(f"  Scenario files updated: {len(updated)}")
    
    total_bmp_size = sum(c["bmp_size"] for c in converted)
    total_png_size = sum(c["png_size"] for c in converted)
    print(f"  Total space saved: {(total_bmp_size - total_png_size)/1024/1024:.1f}MB")
