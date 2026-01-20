#!/usr/bin/env python3
"""
LMS Package Builder
Creates SCORM 1.2 / xAPI compatible ZIP for LMS deployment
"""

import os
import shutil
import zipfile
import argparse
import json
from pathlib import Path
from datetime import datetime

# Files/folders to include in LMS package
INCLUDE = [
    "index.html",
    "style.css",
    "game.js",
    "imsmanifest.xml",
    "tincan.xml",
    "js/",
    "scenarios/",
    "assets/",
]

# Files/folders to exclude
EXCLUDE = [
    "node_modules",
    ".git",
    ".venv",
    "tests",
    "coverage",
    "docs",
    "tools",
    "unreal_scripts",
    "simulator",
    "*.py",
    "*.bat",
    "*.md",
    ".env*",
    "__pycache__",
    ".gemini",
    ".agent",
]


def should_exclude(path: Path, base_dir: Path) -> bool:
    """Check if a path should be excluded"""
    rel_path = str(path.relative_to(base_dir))
    name = path.name

    for pattern in EXCLUDE:
        if pattern.startswith("*"):
            # Extension pattern
            if name.endswith(pattern[1:]):
                return True
        elif pattern in rel_path.split(os.sep):
            return True
        elif name == pattern:
            return True

    return False


def copy_files(src_dir: Path, dest_dir: Path):
    """Copy included files to build directory"""
    copied = 0

    for item in INCLUDE:
        src_path = src_dir / item

        if not src_path.exists():
            print(f"  ⚠ Missing: {item}")
            continue

        if src_path.is_file():
            dest_path = dest_dir / item
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_path, dest_path)
            copied += 1
        elif src_path.is_dir():
            for root, dirs, files in os.walk(src_path):
                root_path = Path(root)

                # Skip excluded directories
                dirs[:] = [d for d in dirs if not should_exclude(root_path / d, src_dir)]

                for file in files:
                    file_path = root_path / file
                    if not should_exclude(file_path, src_dir):
                        rel_path = file_path.relative_to(src_dir)
                        dest_path = dest_dir / rel_path
                        dest_path.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(file_path, dest_path)
                        copied += 1

    return copied


def create_zip(build_dir: Path, output_name: str) -> Path:
    """Create ZIP package from build directory"""
    zip_path = build_dir.parent / output_name

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(build_dir):
            for file in files:
                file_path = Path(root) / file
                arc_name = file_path.relative_to(build_dir)
                zf.write(file_path, arc_name)

    return zip_path


def update_manifest(build_dir: Path):
    """Update imsmanifest.xml with actual file list"""
    manifest_path = build_dir / "imsmanifest.xml"
    if not manifest_path.exists():
        return

    # Collect all files
    files = []
    for root, dirs, file_list in os.walk(build_dir):
        for f in file_list:
            file_path = Path(root) / f
            rel_path = file_path.relative_to(build_dir)
            if str(rel_path) != "imsmanifest.xml":
                files.append(str(rel_path).replace("\\", "/"))

    # Generate file entries
    file_entries = "\n".join([f'      <file href="{f}"/>' for f in sorted(files)])

    # Read and update manifest
    content = manifest_path.read_text(encoding="utf-8")

    # Find resource section and update
    import re
    pattern = r'(<resource[^>]*>)(.*?)(</resource>)'
    replacement = f'\\1\n{file_entries}\n    \\3'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    manifest_path.write_text(content, encoding="utf-8")
    print(f"  ✓ Updated manifest with {len(files)} files")


def main():
    parser = argparse.ArgumentParser(description="Build LMS package")
    parser.add_argument("--clean", action="store_true", help="Clean build directory first")
    parser.add_argument("--zip", action="store_true", help="Create ZIP package")
    parser.add_argument("--version", default="1.0.0", help="Package version")
    args = parser.parse_args()

    # Paths
    project_dir = Path(__file__).parent
    build_dir = project_dir / "lms-build"
    zip_name = f"UE5-Scenario-Tracker-v{args.version}-LMS.zip"

    print("\n" + "=" * 50)
    print("  UE5 Scenario Tracker - LMS Package Builder")
    print("=" * 50 + "\n")

    # Clean if requested
    if args.clean and build_dir.exists():
        print("[1/4] Cleaning build directory...")
        shutil.rmtree(build_dir)

    # Create build directory
    build_dir.mkdir(exist_ok=True)

    # Copy files
    print("[2/4] Copying files...")
    count = copy_files(project_dir, build_dir)
    print(f"  ✓ Copied {count} files")

    # Update manifest
    print("[3/4] Updating manifest...")
    update_manifest(build_dir)

    # Create ZIP
    if args.zip:
        print(f"[4/4] Creating ZIP package...")
        zip_path = create_zip(build_dir, zip_name)
        size_mb = zip_path.stat().st_size / (1024 * 1024)
        print(f"  ✓ Created: {zip_name} ({size_mb:.1f} MB)")

    print("\n" + "=" * 50)
    print("  BUILD COMPLETE!")
    print("=" * 50)
    print(f"\nOutput: {build_dir}")
    if args.zip:
        print(f"Package: {zip_name}")
    print()


if __name__ == "__main__":
    main()
