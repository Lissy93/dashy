# Quick Start

Welcome to Dashy! So glad you're here 😊 In a couple of minutes, you'll have your new dashboard up and running 🚀

**TDLR;** Run `docker run -p 8080:80 lissy93/dashy`, then open `http://localhost:8080`

---

## 1. Prerequisites

The quickest and easiest method of running Dashy is using Docker (or another container engine). You can find installation instructions for your system in the [Docker Documentation](https://docs.docker.com/get-docker/).
If you don't want to use Docker, then you can use one of Dashy's other supported installation methods instead, all of which are outlined in the [Deployment Docs](https://github.com/Lissy93/dashy/blob/master/docs/deployment.md).

---

## 2. Installation

To pull the latest image, and build and start the app run:
```
docker run -d \
  -p 8080:80 \
  -v ~/my-conf.yml:/app/public/conf.yml \
  --name my-dashboard \
  --restart=always \
  lissy93/dashy:latest
```

Either replace the -v path to point to your config file, or leave it out. For a full list of available options, then see [Dashy with Docker](https://github.com/Lissy93/dashy/blob/master/docs/deployment.md#deploy-with-docker) Docs. If you'd prefer to use Docker Compose, then see [Dashy with Docker Compose](https://github.com/Lissy93/dashy/blob/master/docs/deployment.md#using-docker-compose) Docs. Alternate registries, architectures and pinned versions are also supported.

Your dashboard should now be up and running at `http://localhost:8080` (or your servers IP address/ domain, and the port that you chose). The first time you build, it may take a few minutes.

---

## 3. Configure

Now that you've got Dashy running, you are going to want to set it up with your own content.
Config is written in [YAML Format](https://yaml.org/), and saved in [`/public/conf.yml`](https://github.com/Lissy93/dashy/blob/master/public/conf.yml).
The format on the config file is pretty straight forward. There are three root attributes:
- [`pageInfo`](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#pageinfo) - Dashboard meta data, like title, description, nav bar links and footer text
- [`appConfig`](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#appconfig-optional) - Dashboard settings, like themes, authentication, language and customization
- [`sections`](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#section) - An array of sections, each including an array of items


You can view a full list of all available config options in the [Configuring Docs](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md).

```yaml
pageInfo:
  title: Home Lab
sections: # An array of sections
- name: Example Section
  icon: far fa-rocket
  items:
  - title: GitHub
    description: Dashy source code and docs
    icon: fab fa-github
    url: https://github.com/Lissy93/dashy
  - title: Issues
    description: View open issues, or raise a new one
    icon: fas fa-bug
    url: https://github.com/Lissy93/dashy/issues
- name: Local Services
  items:
  - title: Firewall
    icon: favicon
    url: http://192.168.1.1/
  - title: Game Server
    icon: https://i.ibb.co/710B3Yc/space-invader-x256.png
    url: http://192.168.130.1/
```

Notes:
- You can use a Docker volume to pass a config file from your host system to the container
  - E.g. `-v ./host-system/my-local-conf.yml:/app/public/conf.yml`
- It's also possible to edit your config directly through the UI, and changes will be saved in this file
- Check your config against Dashy's schema, with `docker exec -it [container-id] yarn validate-config`
- You might find it helpful to look at some examples, a collection of which can be [found here](https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10)
- After editing your config, the app will rebuild in the background, which may take a minute

---

## 4. Further Customisation

Once you've got Dashy setup, you'll want to ensure the container is properly healthy, secured, backed up and kept up-to-date. All this is covered in the [Management Docs](https://github.com/Lissy93/dashy/blob/master/docs/management.md).


You might also want to check out the docs for specific features you'd like to use:
- [Authentication](/docs/authentication.md) - Setting up authentication to protect your dashboard
- [Alternate Views](/docs/alternate-views.md) - Using the startpage and workspace view
- [Backup & Restore](/docs/backup-restore.md) - Guide to Dashy's cloud sync feature
- [Icons](/docs/icons.md) - Outline of all available icon types for sections and items
- [Localisation](/docs/multi-language-support.md) - How to change language, or add your own
- [Status Indicators](/docs/status-indicators.md) - Using Dashy to monitor uptime and status of your apps
- [Search & Shortcuts](/docs/searching.md) - Using instant filter, web search and custom hotkeys
- [Theming](/docs/theming.md) - Complete guide to applying, writing and modifying themes and styles

---

## 5. Final Note

If you need any help or support in getting Dashy running, head over to the [Discussions](https://github.com/Lissy93/dashy/discussions) page. If you think you've found a bug, please do [raise it](https://github.com/Lissy93/dashy/issues/new/choose) so it can be fixed. For contact options, see the [Support Page](https://github.com/Lissy93/dashy/blob/master/.github/SUPPORT.md).

If you're enjoying Dashy, and have a few minutes to spare, please do take a moment to look at the [Contributing Page](https://github.com/Lissy93/dashy/blob/master/docs/contributing.md). Huge thanks to [everyone](https://github.com/Lissy93/dashy/blob/master/docs/credits.md) who has already helped out!

Enjoy your dashboard :) 

---

## Alternative Deployment Method 1 - From Source

You can also easily run the app on your system without Docker. For this [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/), and [Yarn](https://yarnpkg.com/) are required.

```
git clone https://github.com/Lissy93/dashy.git && cd dashy
yarn # Install dependencies
yarn build # Build the app
yarn start # Start the app
```
Then edit `./public/conf.yml` and rebuild the app with `yarn build`

---

## Alternative Deployment Method 2 - Netlify

Don't have a server? No problem! You can run Dashy for free on Netlify (as well as many [other cloud providers](./docs/deployment.md#deploy-to-cloud-service)). All you need it a GitHub account.
1. Fork Dashy's repository on GitHub
2. [Log in](app.netlify.com/login/) to Netlify with GitHub
3. Click "New site from Git" and select your forked repo, then click **Deploy**!
4. You can then edit the config in `./public/conf.yml` in your repo, and Netlify will rebuild the app

---

## Alternative Deployment Method 3 - Cloud Services

Dashy supports 1-Click deployments on several popular cloud platforms. To spin up a new instance, just click a link below:
- [<img src="https://i.ibb.co/ZxtzrP3/netlify.png" width="18"/> Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy)
- [<img src="https://i.ibb.co/d2P1WZ7/heroku.png" width="18"/> Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/Lissy93/dashy)
- [<img src="https://i.ibb.co/Ld2FZzb/vercel.png" width="18"/> Deploy to Vercel](https://vercel.com/new/project?template=https://github.com/lissy93/dashy)
- [<img src="https://i.ibb.co/xCHtzgh/render.png" width="18"/> Deploy to Render](https://render.com/deploy?repo=https://github.com/lissy93/dashy/tree/deploy_render)
- [<img src="https://i.ibb.co/J7MGymY/googlecloud.png" width="18"/> Deploy to GCP](https://deploy.cloud.run/?git_repo=https://github.com/lissy93/dashy.git)
- [<img src="https://i.ibb.co/HVWVYF7/docker.png" width="18"/> Deploy to PWD](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)