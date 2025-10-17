#!/usr/bin/env python3
"""
Dashy Documentation Updater for Docusaurus
===========================================

This script fetches the latest documentation from the Dashy master branch
and applies all necessary fixes to make it compatible with Docusaurus.

Usage: python3 update-docs.py
"""

import os
import re
import glob
import subprocess
import sys
import shutil
from pathlib import Path

def run_command(cmd, description):
    """Run a shell command and return success status"""
    print(f"📋 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - SUCCESS")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - FAILED")
        print(f"Error: {e.stderr}")
        return False

def download_docs():
    """Download latest docs from master branch"""
    print("🚀 Starting Dashy documentation update...")

    # Create temporary directory
    if os.path.exists('temp_docs'):
        shutil.rmtree('temp_docs')

    # Download docs using git archive
    cmd = 'git archive origin/master docs/ | tar -x -C temp_docs --strip-components=0'
    if not run_command('mkdir -p temp_docs', 'Create temporary directory'):
        return False

    if not run_command('git fetch origin master', 'Fetch latest master branch'):
        return False

    if not run_command('git archive origin/master docs/ | tar -x -C temp_docs', 'Download docs from master'):
        return False

    # Copy to docs directory
    if not run_command('cp -r temp_docs/docs/* docs/', 'Copy docs to current directory'):
        return False

    # Clean up
    shutil.rmtree('temp_docs', ignore_errors=True)

    return True

def fix_markdown_file(filepath):
    """Apply all Docusaurus compatibility fixes to a single markdown file"""
    print(f"🔧 Processing: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading {filepath}: {e}")
        return False

    original_content = content

    # 1. Remove HTML comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)

    # 2. Replace <br> with <br />
    content = re.sub(r'<br\s*>', '<br />', content)
    content = re.sub(r'<br\s*/\s*>', '<br />', content)

    # 3. Fix unterminated <p> tags (the main JSX issue we found)
    # Remove empty <p> tags
    content = re.sub(r'<p>\s*\n\s*</p>', '', content)
    content = re.sub(r'<p[^>]*>\s*\n\s*([^<\n]*)\n\s*</p>', r'\1', content)

    # Fix specific unterminated <p> issue in crypto donation section
    content = re.sub(r'<p>\s*\n\s*(\[!\[.*?\].*?\].*?\n)', r'\1', content)

    # Remove problematic SVG charts that cause JSX errors
    content = re.sub(r'\[!\[Stargazers\].*?starchart\.cc.*?\)', '', content, flags=re.DOTALL)
    content = re.sub(r'\[!\[Contributors\].*?contrib\.rocks.*?\)', '', content, flags=re.DOTALL)
    content = re.sub(r'\[!\[Auto-generated contributors\].*?CONTRIBUTORS\.svg.*?\)', '', content, flags=re.DOTALL)

    # 4. Remove .md extension from links
    content = re.sub(r'\[([^\]]+)\]\(([^)]+)\.md\)', r'[\1](\2)', content)

    # 5. Make links relative - replace ./docs with /docs
    content = re.sub(r'\]\(\./docs/', '](/docs/', content)
    content = re.sub(r'\]\(\.\./docs/', '](/docs/', content)

    # 6. Fix docs/file.md to /docs/file
    content = re.sub(r'\]\(docs/([^)]+)\.md\)', r'](/docs/\1)', content)

    # 7. Fix any remaining .md links and /docs/ prefixes
    content = re.sub(r'(/docs/[^)]+)\.md\)', r'\1)', content)
    content = re.sub(r'(docs/[^)]+)\.md\)', r'/\1)', content)

    # 8. Critical fix: Convert /docs/ links to relative paths for Docusaurus
    # This was the key issue we discovered during testing
    content = re.sub(r'\(/docs/([^)]*)\)', r'(/\1)', content)

    # 9. Replace back to top buttons
    content = re.sub(r'\[⬆️ Back to Top\]\(#[^)]*\)', '**[⬆️ Back to Top](#)**', content)
    content = re.sub(r'<p align="center">\s*<a href="#[^"]*">⬆️ Back to Top</a>\s*</p>', '**[⬆️ Back to Top](#)**', content)

    # 10. Remove <details> tags and convert to headings
    content = re.sub(r'<details[^>]*>\s*<summary>([^<]+)</summary>\s*', r'### \1\n\n', content)
    content = re.sub(r'</details>', '', content)

    # 11. Fix GitHub blob links to relative links
    content = re.sub(r'https://github\.com/[^/]+/[^/]+/blob/[^/]+/docs/([^)]+)\.md', r'/docs/\1', content)
    content = re.sub(r'https://github\.com/[^/]+/[^/]+/blob/[^/]+/docs/([^)]+)', r'/docs/\1', content)

    # 12. Ensure each file has only one main heading
    main_headings = re.findall(r'^# .+', content, re.MULTILINE)
    if len(main_headings) > 1:
        lines = content.split('\n')
        first_main_heading_found = False
        for i, line in enumerate(lines):
            if re.match(r'^# .+', line):
                if first_main_heading_found:
                    lines[i] = '#' + line  # Convert # to ##
                else:
                    first_main_heading_found = True
        content = '\n'.join(lines)

    # 12. Fix self-closing HTML tags
    content = re.sub(r'<img([^>]*[^/])>', r'<img\1 />', content)
    content = re.sub(r'<hr\s*>', '<hr />', content)
    content = re.sub(r'<br\s*>', '<br />', content)

    # 13. Clean up extra whitespace
    content = re.sub(r'\n\n\n+', '\n\n', content)
    content = content.strip()

    # 14. Ensure file ends with newline
    if not content.endswith('\n'):
        content += '\n'

    # 15. Special fixes for known problematic files
    if 'contributing.md' in filepath:
        # Remove problematic SVG contributors chart that causes JSX issues
        content = re.sub(r'\[\!\[Auto-generated contributors\].*?\]\([^)]+\)', '', content, flags=re.DOTALL)
        # Remove star-gazers chart
        content = re.sub(r'### Star-Gazers Over Time.*?$', '', content, flags=re.DOTALL | re.MULTILINE)
        # Fix unterminated <p> tag issue
        content = re.sub(r'- \*\*ZEC\*\*: `[^`]+`\s*\n\s*</p>', lambda m: m.group(0).replace('</p>', ''), content)

    # Only write if content changed
    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {filepath}")
            return True
        except Exception as e:
            print(f"❌ Error writing {filepath}: {e}")
            return False
    else:
        print(f"ℹ️  No changes needed: {filepath}")
        return True

def process_all_docs():
    """Process all markdown files in the docs directory"""
    docs_dir = 'docs'
    if not os.path.exists(docs_dir):
        print(f"❌ Error: {docs_dir} directory not found!")
        return False

    # Find all .md files recursively
    md_files = glob.glob(os.path.join(docs_dir, '**', '*.md'), recursive=True)

    if not md_files:
        print(f"❌ No markdown files found in {docs_dir}")
        return False

    print(f"📚 Found {len(md_files)} markdown files to process...")

    success_count = 0
    for md_file in md_files:
        if fix_markdown_file(md_file):
            success_count += 1
        else:
            print(f"❌ Failed to process {md_file}")

    print(f"\n🎉 Successfully processed {success_count}/{len(md_files)} files!")
    return success_count == len(md_files)

def test_build():
    """Test the Docusaurus build"""
    print("🧪 Testing Docusaurus build...")

    # Kill any running development servers
    run_command("pkill -f 'docusaurus start' || true", "Stop any running dev servers")

    # Test the build
    if run_command("npm run build", "Build Docusaurus site"):
        print("✅ Build successful! All documentation is now Docusaurus compatible.")
        return True
    else:
        print("❌ Build failed. There may be remaining compatibility issues.")
        return False

def main():
    """Main function to orchestrate the documentation update"""
    print("=" * 60)
    print("🚀 Dashy Documentation Updater for Docusaurus")
    print("=" * 60)

    # Check if we're in the right directory
    if not os.path.exists('package.json'):
        print("❌ Error: package.json not found. Please run this script from the Docusaurus project root.")
        sys.exit(1)

    if not os.path.exists('docusaurus.config.js'):
        print("❌ Error: docusaurus.config.js not found. Please run this script from the Docusaurus project root.")
        sys.exit(1)

    steps = [
        ("📥 Download latest docs", download_docs),
        ("🔧 Process all markdown files", process_all_docs),
        ("🧪 Test build", test_build)
    ]

    for step_name, step_func in steps:
        print(f"\n{step_name}")
        print("-" * 40)

        if not step_func():
            print(f"\n❌ FAILED: {step_name}")
            print("Please check the errors above and try again.")
            sys.exit(1)

        print(f"✅ COMPLETED: {step_name}")

    print("\n" + "=" * 60)
    print("🎉 SUCCESS: Documentation update completed successfully!")
    print("=" * 60)
    print("\n📋 Summary:")
    print("• Downloaded latest docs from master branch")
    print("• Fixed all Docusaurus compatibility issues")
    print("• Verified build works correctly")
    print("\n🚀 You can now run 'yarn start' to see your updated docs!")

if __name__ == "__main__":
    main()