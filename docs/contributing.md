

First off, thank you for considering contributing to Dashy! There are two main ways you can help out: [Submitting a Pull Request](#submitting-a-pr) or [Raising an Issue](#raising-an-issue).

### Submitting a PR

Pull requests are proposed code changes, that can then be directly merged into Dashy's master branch and deployed to users. Even a small PR would be a big help.

Not sure what to work on? Here are some ideas:
- Fix a bug, or solve an open issue
- Improve the docs
- Add a new theme
- Implement a new widget
- Add more display options
- Refactor or improve an area of the code
- Implement a new feature, or improve an existing one

Before you submit your pull request, please ensure the following:
- Must be backwards compatible
- All lint checks and tests must pass
- If a new option in the the config file is added, it needs to be added into the schema, and documented in the configuring guide
- If a new dependency is required, it must be essential, and it must be thoroughly checked out for security or efficiency issues

Please also include the following information in your PR:
- PR type (bug fix, feature, code style updates, documentation, etc)
- Issue number (if applicable)
- A brief description of your changes
- A note confirming that your code follows the checklist (above)

#### Getting Started

To set up your development environment, and get Dashy running locally, please see: [Developing Docs](/docs/developing.md)

#### For new Contributors

If you have never created a pull request before, welcome :tada: :smile: [Here is a great tutorial](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)
on how to create a pull request..

1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/<repo-name>
   # Navigate to the newly cloned directory
   cd <repo-name>
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/hoodiehq/<repo-name>
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout master
   git pull upstream master
   ```

3. Create a new topic branch (off the main project development branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Make sure to update, or add to the tests when appropriate. Patches and
   features will not be accepted without tests. Run `yarn test` to check that
   all tests pass after you've made changes, and `yarn lint` for linting.

   ```bash
   git add ./path/to/modified/files
   git commit -m "Fixed #xx by doing xyz"
   ```

5. If you added or changed a feature, make sure to document it accordingly in
   the docs and if applicable, in the `README.md` file.

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

8. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description.

#### Testing the Production App

For larger pull requests, please also check that it works as expected in a production environment.

Testing production app in development environment:
- Natively
	- Build: `yarn build`
	- Run: `yarn start`
- With Docker:
	- Build: `docker build -t dashy .`
	- Run: `docker run -p 8080:80 dashy`

Please also ensure that running the following scripts return no errors:
- `yarn lint`
- `yarn test`
- `yarn validate-config`

A good resource for testing the Docker image on a totally fresh system, is by using [Play with Docker](https://labs.play-with-docker.com/). This will let you clone or pull your image, and spin up a container. This is useful for checking that everything behaves as it should on an independent system, and should get around the _'works on my computer'_ issue.

All required checks will be run as a git-hook after doing a git commit. If you have any issues wit this, it can be disabled with the `--no-verify` flag

#### Merging a PR

Only maintainers can merge a PR. A pull request can only be merged if:
- All CI checks are passing
- It has been approved by either the author, or at least two maintainers
- It has no requested changes
- It is up to date with current master

---

### Raising an Issue

If you've found a bug, or something that isn't working as you'd expect, please raise an issue, so that it can be resolved. If you're having trouble getting things up and running, feel free to ask a question. Feature requests and feedback are also welcome, as it helps Dashy improve.

Click one of the links below, to open an issue:
- [Raise a Bug 🐛](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%90%9B+Bug&template=bug-report---.md&title=%5BBUG%5D) - Found a bug, or something not working as it should?
- [Submit a Feature Request 🦄](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%A6%84+Feature+Request&template=feature-request---.md&title=%5BFEATURE_REQUEST%5D) - Is there a feature that you think is missing from Dashy?
- [Ask a Question 🤷‍♀️](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%A4%B7%E2%80%8D%E2%99%82%EF%B8%8F+Question&template=question------.md&title=%5BQUESTION%5D) - Got a question about using, building or developing Dashy?
- [Share Feedback 🌈](https://github.com/Lissy93/dashy/issues/new?assignees=&labels=%F0%9F%8C%88+Feedback&template=share-feedback---.md&title=%5BFEEDBACK%5D) - Got any thoughts on the current or future development of Dashy?

---

### Contributors

![Auto-generated contributors](https://raw.githubusercontent.com/Lissy93/dashy/03fbaf35ff4653d16a622cfce00a1347c13d0192/docs/assets/CONTRIBUTORS.svg)

### Star-Gazers Over Time

![Stargazers](https://starchart.cc/Lissy93/dashy.svg)

