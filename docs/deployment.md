# Deployment

Welcome to Dashy, so glad you're here :) Deployment is super easy, and there are several methods available depending on what type of system you're using. If you're self-hosting, then deploying with Docker (or similar container engine) is the recommended approach.

## Quick Start

If you want to skip the fuss, and [get straight down to it](/docs/quick-start.md), then you can spin up a new instance of Dashy by running:

```bash
docker run -p 8080:8080 lissy93/dashy
```

See [Management Docs](/docs/management.md) for info about securing, monitoring, updating, health checks, auto starting, web server configuration, etc

Once you've got Dashy up and running, you'll want to configure it with your own content, for this you can reference the [configuring docs](/docs/configuring.md).

## Deployment Methods

- [Deployment](#deployment)
  - [Quick Start](#quick-start)
  - [Deployment Methods](#deployment-methods)
  - [Deploy with Docker](#deploy-with-docker)
  - [Using Docker Compose](#using-docker-compose)
  - [Kubernetes](#kubernetes)
  - [Unraid](#unraid)
  - [Synology NAS](#synology-nas)
  - [Build from Source](#build-from-source)
  - [Deploy to cloud service](#deploy-to-cloud-service)
    - [Netlify](#netlify)
    - [Heroku](#heroku)
    - [Vercel](#vercel)
    - [DigitalOcean](#digitalocean)
    - [Google Cloud Platform](#google-cloud-platform)
    - [Platform.sh](#platformsh)
    - [Render](#render)
    - [Railway](#railway)
    - [Scalingo](#scalingo)
    - [Play-with-Docker](#play-with-docker)
    - [Surge.sh](#surgesh)
    - [Easypanel](#easypanel)
  - [Hosting with CDN](#hosting-with-cdn)
  - [Requirements](#requirements)
    - [System Requirements](#system-requirements)
    - [Docker](#docker)
    - [Bare Metal](#bare-metal)
    - [CDN / Cloud Deploy](#cdn--cloud-deploy)
    - [Browser Support](#browser-support)

---

## Deploy with Docker

**Container Info**: [
![Docker Supported Architecture](https://img.shields.io/badge/Architectures-amd64%20|%20arm32v7%20|%20arm64v8-6ba6e5)
![Docker Base Image](https://img.shields.io/badge/Base_Image-Alpine_3.14-6ba6e5)
![Docker Hosted on](https://img.shields.io/badge/Hosted_on-DockerHub-6ba6e5)
](https://hub.docker.com/r/lissy93/dashy)<br>
**Status**: [
![Docker Build Status](https://img.shields.io/docker/cloud/build/lissy93/dashy?label=Docker%20Build)
![Docker Pulls](https://img.shields.io/docker/pulls/lissy93/dashy?color=ecb2f7)
![Docker Stars](https://img.shields.io/docker/stars/lissy93/dashy?color=f7f754&label=Docker%20Stars)
![Docker Image Size](https://img.shields.io/docker/image-size/lissy93/dashy/latest?color=1eea76)
![Docker Cloud Build](https://img.shields.io/docker/cloud/automated/lissy93/dashy?color=f4a966&label=Docker%20Build)
](https://hub.docker.com/r/lissy93/dashy)

Dashy has a built container image hosted on [Docker Hub](https://hub.docker.com/r/lissy93/dashy). You will need [Docker](https://docs.docker.com/get-docker/) installed on your system.

```bash
docker run -d \
  -p 8080:8080 \
  -v /root/my-local-conf.yml:/app/user-data/conf.yml \
  --name my-dashboard \
  --restart=always \
  lissy93/dashy:latest
```

Explanation of the above options:

- `-d` Detached mode (not running in the foreground of your terminal)
- `-p` The port that should be exposed, and the port it should be mapped to in your host system `[host-port][container-port]`, leave the container port as is
- `-v` Specify volumes, to pass data from your host system to the container, in the format of `[host-path]:[container-path]`, you can use this to pass your config file, directory of assets (like icons), custom CSS or web assets (like favicon.ico, manifest.json etc)
- `--name` Give your container a human-readable name
- `--restart=always` Spin up the container when the daemon starts, or after it has been stopped
- `lissy93/dashy:latest` This last option is the image the container should be built from, you can also use a specific version or architecture type, by replacing `:latest` with one of the [tags](https://hub.docker.com/r/lissy93/dashy/tags)

For all available options, and to learn more, see the [Docker Run Docs](https://docs.docker.com/engine/reference/commandline/run/)

Dashy is also available through GHCR: `docker pull ghcr.io/lissy93/dashy:latest`

If you're deploying Dashy on a modern ARM-based board, such as a Raspberry Pi (2+), then you'll need to use one of Dashy's ARM images. Set the base image + tag to either `lissy93/dashy:arm64v8` or `lissy93/dashy:arm32v7`, depending on your system architecture. You can also use the `multi-arch` image, which should work on all system architectures.

The image defaults to `:latest`, but you can instead specify a specific version, e.g. `docker pull lissy93/dashy:release-1.5.0`

---

## Using Docker Compose

Using Docker Compose can be useful for saving your specific config in files, without having to type out a long run command each time. Save compose config as a YAML file, and then run `docker compose up -d` (optionally use the `-f` flag to specify file location, if it isn't located at `./docker-compose.yml`), `-d` is detached mode (not running in the foreground of your terminal). Compose is also useful if you are using clusters, as the format is very similar to stack files, used with Docker Swarm.

The following is a complete example of a [`docker-compose.yml`](https://github.com/Lissy93/dashy/blob/master/docker-compose.yml) for Dashy. Run it as is, or uncomment the additional options you need.

```yaml
---
version: "3.8"
services:
  dashy:
    # To build from source, replace 'image: lissy93/dashy' with 'build: .'
    # build: .
    image: lissy93/dashy
    container_name: Dashy
    # Pass in your config file below, by specifying the path on your host machine
    # volumes:
      # - /root/my-config.yml:/app/user-data/conf.yml
    ports:
      - 4000:8080
    # Set any environmental variables
    environment:
      - NODE_ENV=production
    # Specify your user ID and group ID. You can find this by running `id -u` and `id -g`
    #  - UID=1000
    #  - GID=1000
    # Specify restart policy
    restart: unless-stopped
    # Configure healthchecks
    healthcheck:
      test: ['CMD', 'node', '/app/services/healthcheck']
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

You can use a different tag, by for example setting `image: lissy93/dashy:arm64v8`, or pull from GHCR instead by setting `image: ghcr.io/lissy93/dashy`.

If you are building from source, and would like to use one of the [other Dockerfiles](https://github.com/Lissy93/dashy/tree/master/docker), then under `services.dashy` first set `context: .`, then specify the the path to the dockerfile, e.g. `dockerfile: ./docker/Dockerfile-arm32v7`

---

## Kubernetes

@vyrtualsynthese has written a Helm Chart for deploying with Kubernetes, available [here](https://github.com/vyrtualsynthese/selfhosted-helmcharts/tree/main/charts/dashy)

---

## Unraid

// TODO

---

## Synology NAS

Installing dashy is really simply and fast:

1. Install Docker via Synology ```Package Center```.
2. Go to ```File Station``` and open the ```docker``` folder. Inside the docker folder, create one new folder and name it ```dashy```.

    > Note: Be careful to enter only lowercase, not uppercase letters.

3. Go to Control Panel / Task Scheduler / Create / Scheduled Task / User-defined script.
4. Once you click on ```User-defined``` script a new window will open.
5. Follow the instructions below:
6. General: In the Task field type in Install dashy. Uncheck "Enabled" option. Select root User.
7. Schedule: Select Run on the following date then select "Do not repeat".
8. Task Settings: Check "Send run details by email", add your email then copy paste the code below in the Run command area. After that click OK.

```bash
docker run -d \
  -p 4000:8080 \
  -v /volume1/docker/dashy/my-local-conf.yml:/app/user-data/conf.yml \
  --name dashy \
  --restart=always \
  lissy93/dashy:latest
```

dashy should be up within 1-2min after you've started the install task procedure

---

## Build from Source

If you do not want to use Docker, you can run Dashy directly on your host system. For this, you will need both [git](https://git-scm.com/downloads) and the latest or LTS version of [Node.js](https://nodejs.org/) installed, and optionally [yarn](https://yarnpkg.com/)

1. Get Code: `git clone https://github.com/Lissy93/dashy.git` and `cd dashy`
2. Configuration: Fill in you're settings in `./user-data/conf.yml`
3. Install dependencies: `yarn`
4. Build: `yarn build`
5. Run: `yarn start`

---

## Deploy to cloud service

If you don't have a home server, then fear not - Dashy can be deployed to pretty much any cloud provider. The above Docker and NPM guides will work exactly the same on a VPS, but I've also setup some 1-Click deploy links for 10+ of the most common cloud providers, to make things easier. Note that if your instance is exposed to the internet, it will be your responsibility to adequately secure it.

Some hosting providers required a bit of extra configuration, which was why I've made separate branches for deploying to those services (named: [`deploy_cloudflare`](https://github.com/Lissy93/dashy/tree/deploy_cloudflare), [`deploy_digital-ocean`](https://github.com/Lissy93/dashy/tree/deploy_digital-ocean), [`deploy_platform-sh`](https://github.com/Lissy93/dashy/tree/deploy_platform-sh) and [`deploy_render`](https://github.com/Lissy93/dashy/tree/deploy_render)). If there's another cloud service which you'd like 1-click deployment to be supported for, feel free to raise an issue.

> [!NOTE]
> If you use a static hosting provider, then status checks, writing new config changes to disk from the UI, and triggering a rebuild through the UI will not be available. This is because these features need endpoints provided by Dashy's local Node server. Everything else should work just the same though.

### Netlify

[![Deploy to Netlify](https://i.ibb.co/GtKMysT/deploy-netlify-button.png)](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy)

[Netlify](https://www.netlify.com/) offers Git-based serverless cloud hosting for web applications. Their services are free to use for personal use, and they support deployment from both public and private repos, as well as direct file upload. The free plan also allows you to use your own custom domain or sub-domain, and is easy to setup.

To deploy Dashy to Netlify, use the following link

```text
https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy
```

### Heroku

[![Deploy to Heroku](https://i.ibb.co/GdMFzBP/deploy-heroku-button.png)](https://heroku.com/deploy?template=https://github.com/Lissy93/dashy)

[Heroku](https://www.heroku.com/) is a fully managed cloud platform as a service. You define app settings in a Procfile and app.json, which specifying how the app should be build and how the server should be started. Heroku costs a minimum of $5 for 1,000 dyno hours per month (there are around 720 hours in a  month), and supports custom domains. Heroku's single-dyno service is not as quite performant as some other providers, and the app will have a short wake-up time when not visited for a while

To deploy Dashy to Heroku, use the following link

```text
https://heroku.com/deploy?template=https://github.com/Lissy93/dashy
```

### Vercel

[![Deploy with Vercel](https://i.ibb.co/mJF3R7m/deploy-vercel-button.png)](https://vercel.com/new/project?template=https://github.com/lissy93/dashy)

[Vercel](https://vercel.com/) is a performance-focused platform for hosting static frontend apps. It comes bundled with some useful tools for monitoring and analyzing application performance and other metrics. Vercel is free for personal use, allows for custom domains and has very reasonable limits.

To deploy Dashy to Vercel, use the following link

```text
https://vercel.com/new/project?template=https://github.com/lissy93/dashy
```

### DigitalOcean

[![Deploy to DO](https://i.ibb.co/PFt0PkB/deploy-digital-ocean-button.png)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/lissy93/dashy/tree/deploy_digital-ocean&refcode=3838338e7f79)

[DigitalOcean](https://www.digitalocean.com/) is a cloud service providing affordable developer-friendly virtual machines from $5/month. But they also have an app platform, where you can run web apps, static sites, APIs and background workers. CDN-backed static sites are free for personal use.

```text
https://cloud.digitalocean.com/apps/new?repo=https://github.com/lissy93/dashy/tree/deploy_digital-ocean
```

### Google Cloud Platform

[![Run on Google Cloud](https://i.ibb.co/LkvHttd/deploy-google-cloud-button.png)](https://deploy.cloud.run/?git_repo=https://github.com/lissy93/dashy.git)

[Cloud Run](https://cloud.google.com/run/) is a service offered by [Google Cloud](https://cloud.google.com/). It's a fully managed serverless platform, for developing and deploying highly scalable containerized applications. Similar to AWS and Azure, GCP offers a wide range of cloud services, which are billed on a pay‐per‐use basis, but Cloud Run has a [free tier](https://cloud.google.com/run/pricing) offering 180,000 vCPU-seconds, 360,000 GiB-seconds, and 2 million requests per month.

To deploy Dashy to GCP, use the following link

```text
https://deploy.cloud.run/?git_repo=https://github.com/lissy93/dashy.git
```

### Platform.sh

[![Deploy to Platform.sh](https://i.ibb.co/nPnJgJP/deploy-platform-sh-button.png)](https://console.platform.sh/projects/create-project/?template=https://github.com/lissy93/dashy&utm_campaign=deploy_on_platform?utm_medium=button&utm_source=affiliate_links&utm_content=https://github.com/lissy93/dashy)

[Platform.sh](https://platform.sh) is an end-to-end solution for developing and deploying applications. It is geared towards enterprise users with large teams, and focuses on allowing applications to scale up and down. Unlike the above providers, Platform.sh is not free, although you can deploy a test app to it without needing a payment method

To deploy Dashy to Platform.sh, use the following link

```text
https://console.platform.sh/projects/create-project/?template=https://github.com/lissy93/dashy
```

### Render

[![Deploy to Render](https://i.ibb.co/QXNCbxT/deploy-render-button.png)](https://render.com/deploy?repo=https://github.com/lissy93/dashy/tree/deploy_render)

[Render](https://render.com) is cloud provider that provides easy deployments for static sites, Docker apps, web services, databases and background workers. Render is great for developing applications, and very easy to use. Static sites are free, and services start at $7/month. Currently there are only 2 server locations - Oregon, USA and Frankfurt, Germany. For more info, see the [Render Docs](https://render.com/docs)

To deploy Dashy to Render, use the following link

```text
https://render.com/deploy?repo=https://github.com/lissy93/dashy/tree/deploy_render
```

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/MtdjAQ?referralCode=app)

[Railway](https://railway.app/) is a Platform as a Service (PaaS) that offers a complete platform for building and delivering programs to the backend of the cloud. You bring your code and Railway does the rest. Railway offers an extremely good developer experience and makes it effortless to deploy apps. Railway offers a free Trial Plan, and paid plans start at $5/month. Railway has 4 server locations: US-west, US-east, EU-west and ASIA-South-East.

```text
https://railway.app/template/MtdjAQ
```

### Scalingo

[![Deploy on Scalingo](https://i.ibb.co/nj0KxyH/deploy-scalingo-button.png)](https://my.scalingo.com/deploy?source=https://github.com/lissy93/dashy#master)

[Scalingo](https://scalingo.com/) is a scalable container-based cloud platform as a service. It's focus is on compliance and uptime, and is geared towards enterprise users. Scalingo is also not free, although they do have a 3-day free trial that does not require a payment method.

To deploy Dashy to Scalingo, use the following link

```text
https://my.scalingo.com/deploy?source=https://github.com/lissy93/dashy#master
```

### Play-with-Docker

[![Try in PWD](https://i.ibb.co/SfbH7Zy/deploy-pwd-button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)

[Play with Docker](https://labs.play-with-docker.com/) is a community project by Marcos Liljedhal and Jonathan Leibiusky and sponsored by Docker, intended to provide a hands-on learning environment. Their labs let you quickly spin up a Docker container or stack, and test out the image in a temporary, sandboxed environment. There's no need to sign up, and it's completely free.

To run Dashy in PWD, use the following URL:

```text
https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml
```

### Surge.sh

![Follow instructions below](https://i.ibb.co/XkcKzKz/deploy-surge-button.png)

[Surge.sh](http://surge.sh/) is quick and easy static web publishing platform for frontend-apps.
Surge supports [password-protected projects](https://surge.sh/help/adding-password-protection-to-a-project). You can also [add a custom domain](https://surge.sh/help/adding-a-custom-domain) and then [force HTTPS by default](https://surge.sh/help/using-https-by-default) and optionally [set a custom SSL certificate](https://surge.sh/help/securing-your-custom-domain-with-ssl)

To deploy Dashy to Surge.sh, first clone and cd into Dashy, install dependencies, and then use the following commands

```bash
yarn add -g surge
yarn build
surge ./dist
```

### Easypanel

[![Deploy to Easypanel](https://i.ibb.co/ZNPwQX3/deploy-easypanel-button.png)](https://easypanel.io/docs/templates/dashy)

[Easypanel](https://easypanel.io) it's a modern server control panel. You can use it to deploy Dashy on your own server.

To deploy Dashy to Easypanel, use the following link

```text
https://easypanel.io/docs/templates/dashy
```

---

## Hosting with CDN

Once Dashy has been built, it is effectively just a static web app. This means that it can be served up with pretty much any static host, CDN or web server. To host Dashy through a CDN, the steps are very similar to building from source: clone the project, cd into it, install dependencies, write your config file and build the app. Once build is complete you will have a `./dist` directory within Dashy's root, and this is the build application which is ready to be served up.

However without Dashy's node server, there are a couple of features that will be unavailable to you, including: Writing config changes to disk through the UI, triggering a rebuild through the UI and application status checks. Everything else will work fine.

---

## Requirements

### System Requirements

Dashy works well on a Raspberry Pi (tested on Pi 3 and later), but should also run well on any system.

### Docker

Initial app build causes a spike in resource usage, but once the built app is running it is fairly steady. For this reason, Dashy works best with a minimum of 1GB of memory, and 1GB of disk space.

### Bare Metal

Minimum 526mb mem, 2GB disk space.

### CDN / Cloud Deploy

No specific requirements. The built application alone (without the Node server) is very light-weight, and can be handled smoothly by pretty much any CDN or cloud deployment service (see [this list](/docs/deployment.md#deploy-to-cloud-service) or natively supported cloud providers).

If you're using your own icons, or other assets, additional disk space will be required for those resources.

### Browser Support

JavaScript is required to run Dashy.

In terms of browser support, pretty much any browser released since 2018 should render content just fine. However, for Internet Explorer, only IE11+ is supported, yet performance here is still not optimal. The recommended browser is either a Chromium-based / Webkit browser (Chrome, Brave, Vivaldi, Edge, Yandex, etc), or Firefox or one of it's forks (FF-ESR, Tor, LibreWolf, etc). Recent versions of Safari and Opera are also supported, but with limited continuous testing.

<p align="center"><img width="500" src="https://i.ibb.co/pjnmbw9/browser-compatibility.png" /></p>
