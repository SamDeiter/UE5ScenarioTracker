#!/usr/bin/env python3
"""
LMS Build Script - Creates production SCORM package
Strips development features: launcher, generator, debug mode

Usage:
    python build-lms.py                    # Basic build
    python build-lms.py --version 2.0.0    # With version
    python build-lms.py --zip              # Create ZIP package
    python build-lms.py --clean            # Clean before build
"""

import shutil
import re
import argparse
import zipfile
from pathlib import Path
from datetime import datetime


class LMSBuilder:
    """Automated LMS/SCORM package builder"""
    
    def __init__(self, source_dir='.', build_dir='lms-build', version=None):
        self.source = Path(source_dir).resolve()
        self.build_dir = Path(build_dir).resolve()
        self.version = version or '1.0.0'
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
    def clean_build_dir(self):
        """Remove existing build directory"""
        if self.build_dir.exists():
            print(f"🗑️  Cleaning existing build directory")
            shutil.rmtree(self.build_dir)
        self.build_dir.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created clean build directory")
    
    def copy_core_files(self):
        """Copy necessary files for LMS (excluding dev tools)"""
        print("\n📦 Copying core files...")
        
        # Files to copy directly
        core_files = [
            'style.css',
            'imsmanifest.xml',
            'localization.js',
            'game.js',
            'questions.js',
        ]
        
        for file in core_files:
            src = self.source / file
            if src.exists():
                shutil.copy2(src, self.build_dir / file)
                print(f"  ✓ {file}")
        
        # Directories to copy entirely
        core_dirs = [
            'js',
            'scenarios',
            'assets',
        ]
        
        for dir_name in core_dirs:
            src_dir = self.source / dir_name
            if src_dir.exists():
                dst_dir = self.build_dir / dir_name
                shutil.copytree(src_dir, dst_dir)
                file_count = len(list(dst_dir.rglob('*')))
                print(f"  ✓ {dir_name}/ ({file_count} files)")
        
        print("✅ Core files copied")
    
    def modify_index_html(self):
        """Remove launcher and debug controls from index.html"""
        print("\n🔧 Modifying index.html for LMS...")
        
        src_html = self.source / 'index.html'
        with open(src_html, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # Inject LMS build flag in head section
        html = html.replace(
            '</head>',
            '    <script>\n        window.IS_LMS_BUILD = true;\n    </script>\n</head>'
        )
        print("  ✓ Injected IS_LMS_BUILD flag")
        
        # Remove launcher link (find and remove the anchor tag)
        html = re.sub(
            r'<a href="launcher\.html"[^>]*>.*?</a>',
            '<!-- Launcher link removed in LMS build -->',
            html,
            flags=re.DOTALL
        )
        print("  ✓ Removed launcher link")
        
        # Remove generator link
        html = re.sub(
            r'<a href="http://localhost:5000/"[^>]*>.*?</a>',
            '<!-- Generator link removed in LMS build -->',
            html,
            flags=re.DOTALL
        )
        print("  ✓ Removed generator link")
        
        # Remove debug controls container (lines with debug-controls-container)
        html = re.sub(
            r'<div id="debug-controls-container"[^>]*>.*?</div>\s*(?=<div)',
            '<!-- Debug controls removed in LMS build -->\n                ',
            html,
            flags=re.DOTALL
        )
        print("  ✓ Removed debug controls")
        
        # Remove debug dropdown
        html = re.sub(
            r'<div id="debug-dropdown"[^>]*>.*?</div>\s*</div>',
            '<!-- Debug dropdown removed in LMS build -->',
            html,
            flags=re.DOTALL
        )
        print("  ✓ Removed debug dropdown")
        
        # Write modified HTML
        with open(self.build_dir / 'index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("✅ index.html modified for LMS")
    
    def modify_game_js(self):
        """Disable debug features in game.js for LMS"""
        print("\n🔧 Modifying game.js for LMS...")
        
        src_js = self.build_dir / 'game.js'
        with open(src_js, 'r', encoding='utf-8') as f:
            js = f.read()
        
        # Add IS_LMS_BUILD check at the top of DOMContentLoaded
        js = js.replace(
            "document.addEventListener('DOMContentLoaded', () => {",
            "document.addEventListener('DOMContentLoaded', () => {\n\n    // --- LMS BUILD DETECTION ---\n    const IS_LMS_BUILD = window.IS_LMS_BUILD || false;\n",
            1
        )
        print("  ✓ Added IS_LMS_BUILD detection")
        
        # Disable showPasswordModal function
        js = re.sub(
            r'(function showPasswordModal\(\))',
            r'// DISABLED IN LMS BUILD\n    function showPasswordModal() { if (IS_LMS_BUILD) return;',
            js
        )
        print("  ✓ Disabled password modal")
        
        # Add early return to toggleDebugMode
        js = re.sub(
            r'(function toggleDebugMode\(forceDisable = false\) \{)',
            r'\1\n        if (IS_LMS_BUILD) return; // Disabled in LMS build',
            js
        )
        print("  ✓ Disabled debug mode toggle")
        
        # Wrap debug navigation in IS_LMS_BUILD check
        js = re.sub(
            r"(// --- DEBUG NAVIGATION ---\s*document\.getElementById\('debug-prev-step'\))",
            r"// --- DEBUG NAVIGATION (DISABLED IN LMS BUILD) ---\n    if (!IS_LMS_BUILD) {\n        \1",
            js
        )
        # Close the if block before the closing brace of DOMContentLoaded
        js = re.sub(
            r"(\}\n\n\}\);)$",
            r"    }\n\n});",
            js
        )
        print("  ✓ Disabled debug navigation")
        
        # Disable debug toggle event listener
        js = re.sub(
            r"(if \(debugToggle\) \{\s*debugToggle\.addEventListener\('change')",
            r"if (!IS_LMS_BUILD && debugToggle) {\n            debugToggle.addEventListener('change'",
            js
        )
        print("  ✓ Disabled debug toggle listener")
        
        # Write modified JS
        with open(src_js, 'w', encoding='utf-8') as f:
            f.write(js)
        
        print("✅ game.js modified for LMS")
    
    def update_manifest(self):
        """Update SCORM manifest with current file list and version"""
        print("\n📋 Updating SCORM manifest...")
        
        manifest_path = self.build_dir / 'imsmanifest.xml'
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest = f.read()
        
        # Update manifest identifier with version and timestamp
        new_identifier = f'UE5_SCENARIO_TRACKER_LMS_v{self.version}_{self.timestamp}'
        manifest = re.sub(
            r'identifier="[^"]*"',
            f'identifier="{new_identifier}"',
            manifest,
            count=1
        )
        print(f"  ✓ Updated identifier: {new_identifier}")
        
        # Build file list
        files_section = self._generate_file_list()
        
        # Replace resource section
        manifest = re.sub(
            r'<resource identifier="RES1"[^>]*>.*?</resource>',
            files_section,
            manifest,
            flags=re.DOTALL
        )
        print(f"  ✓ Updated file list")
        
        # Write updated manifest
        with open(manifest_path, 'w', encoding='utf-8') as f:
            f.write(manifest)
        
        print("✅ Manifest updated")
    
    def _generate_file_list(self):
        """Generate SCORM manifest file list from build directory"""
        file_entries = []
        file_entries.append('      <file href="index.html"/>')
        file_entries.append('      <file href="style.css"/>')
        file_entries.append('      <file href="game.js"/>')
        file_entries.append('      <file href="questions.js"/>')
        
        # Add all JS files from js/ directory
        js_dir = self.build_dir / 'js'
        if js_dir.exists():
            js_files = list(js_dir.glob('*.js'))
            for js_file in js_files:
                file_entries.append(f'      <file href="js/{js_file.name}"/>')
        
        # Add all scenario files
        scenarios_dir = self.build_dir / 'scenarios'
        if scenarios_dir.exists():
            scenario_files = list(scenarios_dir.glob('*.js'))
            for scenario_file in scenario_files:
                file_entries.append(f'      <file href="scenarios/{scenario_file.name}"/>')
        
        # Add all asset files
        assets_dir = self.build_dir / 'assets'
        if assets_dir.exists():
            asset_files = list(assets_dir.rglob('*'))
            for asset_path in asset_files:
                if asset_path.is_file():
                    rel_path = asset_path.relative_to(self.build_dir)
                    file_entries.append(f'      <file href="{rel_path.as_posix()}"/>')
        
        files_xml = '\n'.join(file_entries)
        
        return f'''<resource identifier="RES1" type="webcontent" adlcp:scormtype="sco" href="index.html">
{files_xml}
    </resource>'''
    
    def create_zip(self):
        """Create SCORM .zip package"""
        print("\n📦 Creating SCORM ZIP package...")
        
        zip_name = f'UE5-Scenario-Tracker-v{self.version}-LMS.zip'
        zip_path = self.source / zip_name
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in self.build_dir.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(self.build_dir)
                    zipf.write(file_path, arcname)
        
        size_mb = zip_path.stat().st_size / (1024 * 1024)
        print(f"✅ Created {zip_name} ({size_mb:.2f} MB)")
        
        return zip_path
    
    def build(self, create_zip=False):
        """Execute full build pipeline"""
        print("🚀 Starting LMS build process...")
        print(f"   Version: {self.version}")
        print(f"   Source:  {self.source}")
        print(f"   Build:   {self.build_dir}")
        
        self.clean_build_dir()
        self.copy_core_files()
        self.modify_index_html()
        self.modify_game_js()
        self.update_manifest()
        
        # Summary
        file_count = len([f for f in self.build_dir.rglob('*') if f.is_file()])
        total_size = sum(f.stat().st_size for f in self.build_dir.rglob('*') if f.is_file())
        size_mb = total_size / (1024 * 1024)
        
        print(f"\n✅ LMS build complete!")
        print(f"   Files: {file_count}")
        print(f"   Size: {size_mb:.2f} MB")
        print(f"   Location: {self.build_dir}")
        
        if create_zip:
            zip_path = self.create_zip()
            print(f"\n📦 Package ready for LMS upload:")
            print(f"   {zip_path}")


def main():
    parser = argparse.ArgumentParser(
        description='Build LMS/SCORM package from development codebase'
    )
    parser.add_argument(
        '--version',
        help='Version number for the build (default: 1.0.0)',
        default=None
    )
    parser.add_argument(
        '--zip',
        action='store_true',
        help='Create ZIP package after build'
    )
    parser.add_argument(
        '--clean',
        action='store_true',
        help='Clean build directory before starting (default: always clean)'
    )
    
    args = parser.parse_args()
    
    builder = LMSBuilder(version=args.version)
    builder.build(create_zip=args.zip)


if __name__ == '__main__':
    main()
