Dashy Documentation Website - Usage Instructions
=================================================

This directory contains the Docusaurus-based documentation website for Dashy.

DEVELOPMENT COMMANDS
--------------------

Start Development Server
    yarn start
    # Opens http://localhost:3000 with live reload

Build Production Site
    npm run build
    # Builds static files to build/ directory

Serve Built Site Locally
    yarn serve
    # Serves the built site locally for testing


DEPLOYMENT
----------
- The web source (what you're looking at now), lives in the `WEBSITE/docs-site-source` branch
- This gets built, using https://github.com/Lissy93/dashy/actions/workflows/build-docs-site.yml
- Which compiles the site, and uploads the static files to the `website` branch
- From there, it can be consumed by GitHub Pages, Netlify or any other hosting provider
- And it is made available at https://dashy.to/


UPDATNIG DOCS FROM MASTER
-------------------------
Run `python3 do-doc-updaty-magic.py`

This script will:
- Download latest docs from Dashy's master branch
- Fix all Docusaurus compatibility issues
- Test the build to ensure everything works
- Show a summary of changes

Or, if you like to do stuff slowly and manually:
1. Copy markdown files to docs/ directory
2. Fix Docusaurus compatibility issues:
   - Remove HTML comments (<!-- -->)
   - Replace <br> with <br />
   - Remove .md extensions from links: [text](file.md) → [text](file)
   - Make links relative: ./docs/file → /docs/file
   - Replace back-to-top buttons: **[⬆️ Back to Top](#)**
   - Remove <details> tags
   - Ensure single # heading per file


WEBSITE STRUCTURE
-----------------
- docs/           - Documentation markdown files
- src/            - React components and pages
- static/         - Static assets (images, icons, etc.)
- docusaurus.config.js - Main configuration file
- sidebars.js     - Sidebar navigation configuration

TROUBLESHOOTING
---------------

### Build Errors
If you encounter build errors:
1. Check for JSX syntax errors in markdown files
2. Ensure all links are properly formatted (no .md extensions)
3. Verify all referenced files exist
4. Run: yarn clear && yarn start

### Link Warnings
Warnings about "couldn't be resolved" links are usually non-critical.
They indicate internal links that Docusaurus can't verify but often work fine.

### JSX Errors
Common JSX errors in markdown:
- Unclosed HTML tags (use <br /> not <br>)
- Unescaped special characters
- Problematic SVG or image embeds

### Missing Dependencies
If yarn commands fail
- use `nvm` to switch node versions
- and reinstall with `yarn`


