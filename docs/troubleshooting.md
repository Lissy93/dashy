# Troubleshooting

This document contains common problems and their solutions.

### Yarn Error

For more info, see [Issue #1](https://github.com/Lissy93/dashy/issues/1)

First of all, check that you've got yarn installed correctly - see the [yarn installation docs](https://classic.yarnpkg.com/en/docs/install) for more info.

If you're getting an error about scenarios, then you've likely installed the wrong yarn... (you're [not](https://github.com/yarnpkg/yarn/issues/2821) the only one!). You can fix it by uninstalling, adding the correct repo, and reinstalling, for example, in Debian:
- `sudo apt remove yarn`
- `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
- `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
- `sudo apt update && sudo apt install yarn`

Alternatively, as a workaround, you have several options:
- Try using [NPM](https://www.npmjs.com/get-npm) instead: So clone, cd, then run `npm install`, `npm run build` and `npm start`
- Try using [Docker](https://www.docker.com/get-started) instead, and all of the system setup and dependencies will already be taken care of. So from within the directory, just run `docker build -t lissy93/dashy .` to build, and then use docker start to run the project, e.g: `docker run -it -p 8080:80 lissy93/dashy` (see the [deploying docs](https://github.com/Lissy93/dashy/blob/master/docs/deployment.md#deploy-with-docker) for more info)

