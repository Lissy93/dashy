
# Releases and Workflows

- [Release Schedule](#release-schedule)
- [Deployment Process](#deployment-process)
- [Git Strategy](#git-strategy)
- [Automated Workflows](#automated-workflows)

## Release Schedule

We're using [Semantic Versioning](https://semver.org/), to indicate major, minor and patch versions. You can find the current version number in the readme, and check your apps version under the config menu. The version number is pulled from the [package.json](https://github.com/Lissy93/dashy/blob/master/package.json#L3) file.

Typically there is a new major release every 2 weeks, usually on Sunday, and you can view these under the [Releases Page](https://github.com/Lissy93/dashy/releases). Each new version will also have a corresponding [tag on GitHub](https://github.com/Lissy93/dashy/tags), and each major release will also result in the creation of a new [tag on DockerHub](https://hub.docker.com/r/lissy93/dashy/tags), so that you can fix your container to a certain version.

For a full breakdown of each change, you can view the [Changelog](https://github.com/Lissy93/dashy/blob/master/.github/CHANGELOG.md). Each new feature or significant change needs to be submitted through a pull request, which makes it easy to review and track these changes, and roll back if needed.

---

## Deployment Process

All changes and new features are submitted as pull requests, which can then be tested, reviewed and (hopefully) merged into the master branch. Every time there is a change in the major version number, a new release is published. This usually happens every 2 weeks, on a Sunday.

When a PR is opened:
- The feature branch is built, and deployed as a Netlify instance. This can be accessed at: `https://deploy-preview-[pr-number]--dashy-dev.netlify.app`, and this URL as well as a link to the build logs are added as a comment on the PR by Netlify bot
- Depending on what files were modified, the bot may also add a comment to remind the author of useful info
- A series of checks will run on the new code, using GH Actions, and prevent merging if they fail. This includes: linting, testing, code quality and complexity checking, security scanning and a spell check
- If a new dependency was added, liss-bot will comment with a summary of those changes, as well as the cost of the module, version, and any security concerns. If the bundle size has increased, this will also be added as a comment

After the PR is merged:
- The app is build, and deployed to: https://dev.dashy.to
- A new tag in GitHub is created, using the apps version number (from the package.json)
- The Docker container is built, and published under the `:latest` tag on DockerHub and GHCR

When a new major version is released:
- A new GitHub release is created and published, under new versions tag, with info from the changelog
- The container is built and published under a new tag will be created on DockerHub, called `:release-[version]`
- An announcement is opened in GitHub discussions, outlining the main changes, where users can comment and ask questions

[![Netlify Status](https://api.netlify.com/api/v1/badges/3a0216c3-1ed0-40f5-ad90-ff68b1c96c09/deploy-status)](https://app.netlify.com/sites/dashy-dev/deploys)

---

## Git Strategy

### Git Flow
Like most Git repos, we are following the [Github Flow](https://guides.github.com/introduction/flow) standard.

1. Create a branch (or fork if you don'd have write acces)
2. Code some awesome stuff, then add and commit your changes
3. Create a Pull Request, complete the checklist and ensure the build succeeds
4. Follow up with any reviews on your code
5. Merge 🎉

### Git Branch Naming
The format of your branch name should be something similar to: `[TYPE]/[TICKET]_[TITLE]`
For example, `FEATURE/420_Awesome-feature` or `FIX/690_login-server-error`

### Commit Emojis
Using a single emoji at the start of each commit message, to indicate the type task, makes the commit ledger easier to understand, plus it looks cool.

- 🎨 `:art:` - Improve structure / format of the code.
- ⚡️ `:zap:` - Improve performance.
- 🔥 `:fire:` - Remove code or files.
- 🐛 `:bug:` - Fix a bug.
- 🚑️ `:ambulance:` - Critical hotfix
- ✨ `:sparkles:` - Introduce new features.
- 📝 `:memo:` - Add or update documentation.
- 🚀 `:rocket:` - Deploy stuff.
- 💄 `:lipstick:` - Add or update the UI and style files.
- 🎉 `:tada:` - Begin a project.
- ✅ `:white_check_mark:` - Add, update, or pass tests.
- 🔒️ `:lock:` - Fix security issues.
- 🔖 `:bookmark:` - Make a Release or Version tag.
- 🚨 `:rotating_light:` - Fix compiler / linter warnings.
- 🚧 `:construction:` - Work in progress.
- ⬆️ `:arrow_up:` - Upgrade dependencies.
- 👷 `:construction_worker:` - Add or update CI build system.
- ♻️ `:recycle:` - Refactor code.
- 🩹 `:adhesive_bandage:` - Simple fix for a non-critical issue.
- 🔧 `:wrench:` - Add or update configuration files.
- 🍱 `:bento:` - Add or update assets.
- 🗃️ `:card_file_box:` - Perform database schema related changes.
- ✏️ `:pencil2:` - Fix typos.
- 🌐 `:globe_with_meridians:` - Internationalization and translations.

For a full list of options, see [gitmoji.dev](https://gitmoji.dev/)

### PR Guidelines
Once you've made your changes, and pushed them to your fork or branch, you're ready to open a pull request!

For a pull request to be merged, it must:
- Must be backwards compatible
- The build, lint and tests (run by GH actions) must pass
- There must not be any merge conflicts

When you submit your PR, include the required info, by filling out the PR template. Including:
- A brief description of your changes
- The issue, ticket or discussion number (if applicable)
- For UI relate updates include a screenshot
- If any dependencies were added, explain why it was needed, state the cost associated, and confirm it does not introduce any security issues
- Finally, check the checkboxes, to confirm that the standards are met, and hit submit!

---

## Automated Workflows

Dashy makes heavy use of [GitHub Actions](https://github.com/features/actions) to fully automate the checking, testing, building, deploying of the project, as well as administration tasks like management of issues, tags, releases and documentation. The following section outlines each workflow, along with a link the the action file, current status and short description. A lot of these automations were made possible using community actions contributed to GH marketplace by some amazing people.   


### Code Processing

Action | Description
--- | ---
**Code Linter**<br/>[![code-linter.yml](https://github.com/Lissy93/dashy/actions/workflows/code-linter.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/code-linter.yml) | After a pull request is created, all new code changes will be linted, and the CI will fail with a helpful message if the code has any formatting inconsistencies
**Code Spell Check**<br/>[![code-spell-check.yml](https://github.com/Lissy93/dashy/actions/workflows/code-spell-check.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/code-spell-check.yml) | After a PR submitted, all auto-fixable spelling errors will be detected, then Liss-Bot will create a separate PR to propose the fixes
**Dependency Update Summary** <br/>[![dependency-updates-summary.yml](https://github.com/Lissy93/dashy/actions/workflows/dependency-updates-summary.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/dependency-updates-summary.yml) | After a PR is submitted, if any of the dependencies are modified, then Liss-Bot will add a comment, explaining which packages have been added, removed, updated or downgraded, as well as other helpful info
**Get Size** <br/>[![get-size.yml](https://github.com/Lissy93/dashy/actions/workflows/get-size.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/get-size.yml) | Adds comment to PR if the size of the built + bundled application has changed compared to the previous version
**Security Scan** <br/>[![security-scanning.yml](https://github.com/Lissy93/dashy/actions/workflows/security-scanning.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/security-scanning.yml) | Uses Snyk to scan the code and dependencies after a PR. Will add a comment and cause the build to fail if a new vulnerability or potential issue is present

### Releases

Action | Description
--- | ---
**Create Tag** <br/>[![auto-tag-pr.yml](https://github.com/Lissy93/dashy/actions/workflows/auto-tag-pr.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/auto-tag-pr.yml) | Whenever the version indicated in package.json is updates, a new GitHub tag will be created for that point in time
**Build App** <br/>[![build-app.yml](https://github.com/Lissy93/dashy/actions/workflows/build-app.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/build-app.yml) | After changes are merged into the master branch, the app will be build, with output pushed to the `dev-demo` branch
**Cache Artifacts** <br/>[![cache-artifacts.yml](https://github.com/Lissy93/dashy/actions/workflows/cache-artifacts.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/cache-artifacts.yml) | After build, returned files will be cached for future actions for that commit
**Docker Publish** <br/>[![docker-publish.yml](https://github.com/Lissy93/dashy/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/docker-publish.yml) | After PR is merged, the multi-architecture Docker container will be built, and then published to GHCR

### Issue Management

Action | Description
--- | ---
**Close Incomplete Issues** <br/>[![close-incomplete-issues.yml](https://github.com/Lissy93/dashy/actions/workflows/close-incomplete-issues.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/close-incomplete-issues.yml) | Issues which do not match any of the issue templates will be closed, and a comment posted explaining why
**Close Stale Issues** <br/>[![close-stale-issues.yml](https://github.com/Lissy93/dashy/actions/workflows/close-stale-issues.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/close-stale-issues.yml) | Issues which have not been updated for 6 weeks will have a comment posted to them. If the author does not reply within the next week, then the issue will be marked as stale and closed. The original author may still reopen the issue at any time
**Close Potential Spam Issues** <br/>[![issue-spam-control.yml](https://github.com/Lissy93/dashy/actions/workflows/issue-spam-control.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/issue-spam-control.yml) | Auto-closes issues, and adds a comment if it was submitted by a user who hasn't yet interacted with the repo, is new to GitHub and has not starred the repository. The comment will advise them to check their issue is complete, and then allow them to reopen it
**Issue Translator** <br/>[![issue-translator.yml](https://github.com/Lissy93/dashy/actions/workflows/issue-translator.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/issue-translator.yml) | Auto-translates any comments and issues that were written in any language other than English, and posts the translation as a comment below
**Label Sponsors** <br/>[![label-sponsors.yml](https://github.com/Lissy93/dashy/actions/workflows/label-sponsors.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/label-sponsors.yml) | Adds a special label to any issues or pull requests raised by users who are sponsoring the project via GitHub, so that they can get priority support
**LGTM Comment**<br/>[![lgtm-comment.yml](https://github.com/Lissy93/dashy/actions/workflows/lgtm-comment.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/lgtm-comment.yml) | When a PR review contains the words LGTM (looks good to me), the Liss-Bot will reply with a random celebratory or thumbs up GIF, just as a bit of fun
**Mind your Language** <br/>[![mind-your-language.yml](https://github.com/Lissy93/dashy/actions/workflows/mind-your-language.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/mind-your-language.yml) | Replies to any comment (on issue or PR) that contains profanities, offensive or inappropriate language with a polite note reminding the user of the code of conduct
**Release Notifier** <br/>[![release-commenter.yml](https://github.com/Lissy93/dashy/actions/workflows/release-commenter.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/release-commenter.yml) | Once a release has been published which fixes an issue, a comment will be added to the relevant issues informing the user who raised it that it was fixed in the current release
**Update Issue after Merge** <br/>[![update-issue-after-pr.yml](https://github.com/Lissy93/dashy/actions/workflows/update-issue-after-pr.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/update-issue-after-pr.yml) | After a PR which fixes an issue is merged, Liss-Bot will add a comment to said issue based on the git commit message
**Auto Add Comment Based on Tag** <br/>[![add-comment-from-tag.yml](https://github.com/Lissy93/dashy/actions/workflows/add-comment-from-tag.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/add-comment-from-tag.yml) | Will add comment with useful info to certain issues, based on the tag applied

### PR Management

Action | Description
--- | ---
**PR Commenter** <br/>[![pr-commenter.yml](https://github.com/Lissy93/dashy/actions/workflows/pr-commenter.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/pr-commenter.yml) | Adds comment with helpful info to pull requests, based on which files have been changes
**Issue from Todo Code** <br/>[![raise-issue-from-todo.yml](https://github.com/Lissy93/dashy/actions/workflows/raise-issue-from-todo.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/raise-issue-from-todo.yml) | When a `todo` note is found in the code after a PR, then Liss-Bot will automatically raise an issue, so that the todo can be addressed/ implemented. The issue will be closed once the todo has been implemented or removed

### Documentation & Reports

Action | Description
--- | ---
**Generate Credits** <br/>[![generate-credits.yml](https://github.com/Lissy93/dashy/actions/workflows/generate-credits.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/generate-credits.yml) | Generates a report, including contributors, collaborators, sponsors, bots and helpful users. Will then insert a markdown table with thanks to these GitHub users and links to their profiles into the Credits page, as well as a summary of sponsors and top contributors into the main readme
**Wiki Sync** <br/>[![wiki-sync.yml](https://github.com/Lissy93/dashy/actions/workflows/wiki-sync.yml/badge.svg)](https://github.com/Lissy93/dashy/actions/workflows/wiki-sync.yml) | Generates and publishes the repositories wiki page using the markdown files within the docs directory

---