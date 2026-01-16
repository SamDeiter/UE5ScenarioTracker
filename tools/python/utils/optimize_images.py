import os
from PIL import Image
import glob

assets_dir = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated"

total_saved = 0
files_processed = 0

for scenario_dir in os.listdir(assets_dir):
    scenario_path = os.path.join(assets_dir, scenario_dir)
    if not os.path.isdir(scenario_path):
        continue
    
    for img_file in glob.glob(os.path.join(scenario_path, "*.png")):
        original_size = os.path.getsize(img_file)
        
        # Open and resave with optimization
        with Image.open(img_file) as img:
            # Convert to RGB if RGBA and no transparency needed
            if img.mode == 'RGBA':
                # Check if any pixel actually uses transparency
                if img.split()[3].getextrema()[0] == 255:
                    img = img.convert('RGB')
            
            # Resize if larger than 512x512 (still good quality for web)
            if img.width > 512 or img.height > 512:
                img.thumbnail((512, 512), Image.LANCZOS)
            
            # Save as optimized JPEG (much smaller than PNG)
            jpg_path = img_file.replace('.png', '.jpg')
            img.convert('RGB').save(jpg_path, 'JPEG', quality=85, optimize=True)
        
        # Remove original PNG
        os.remove(img_file)
        
        new_size = os.path.getsize(jpg_path)
        saved = original_size - new_size
        total_saved += saved
        files_processed += 1

print(f"Processed {files_processed} images")
print(f"Total space saved: {total_saved / (1024*1024):.1f} MB")
print(f"Average per image: {total_saved / max(files_processed, 1) / 1024:.0f} KB saved")
