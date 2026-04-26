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
  - [Podman](#podman)
  - [Portainer](#portainer)
  - [Kubernetes](#kubernetes)
  - [Unraid](#unraid)
  - [Home Server Platforms](#home-server-platforms)
  - [Synology NAS](#synology-nas)
  - [Build from Source](#build-from-source)
  - [Deploy to Cloud Service](#deploy-to-cloud-service)
    - [Netlify](#netlify)
    - [Vercel](#vercel)
    - [Easypanel](#easypanel)
    - [EdgeOne Pages](#edgeone-pages)
    - [Play-with-Docker](#play-with-docker)
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
![Docker Base Image](https://img.shields.io/badge/Base_Image-Alpine_3.19-6ba6e5)
![Docker Hosted on](https://img.shields.io/badge/Hosted_on-DockerHub%20%26%20GHCR-6ba6e5)
](https://hub.docker.com/r/lissy93/dashy)<br>
**Status**:
![Build Status](https://img.shields.io/github/actions/workflow/status/Lissy93/dashy/docker-build-publish.yml?label=Build&color=f4a966)
![Docker Pulls](https://img.shields.io/docker/pulls/lissy93/dashy?color=ecb2f7)
![Docker Stars](https://img.shields.io/docker/stars/lissy93/dashy?color=f7f754&label=Docker%20Stars)
![Docker Image Size](https://img.shields.io/docker/image-size/lissy93/dashy/latest?color=1eea76)
![Docker Latest Version](https://img.shields.io/docker/v/lissy93/dashy/latest?color=a8d8ea&label=Latest%20Version)

Dashy has a built container image hosted on [Docker Hub](https://hub.docker.com/r/lissy93/dashy). You will need [Docker](https://docs.docker.com/get-docker/) installed on your system.

```bash
docker run -d \
  -p 8080:8080 \
  -v /path/to/your/user-data:/app/user-data \
  --name my-dashboard \
  --restart=always \
  lissy93/dashy:latest
```

The `user-data` directory you mount must contain a `conf.yml` file. It can also contain any sub-config files, item icons, fonts, custom CSS, or other assets you want served from the web root. Anything you put in there is available at `/<filename>` in the browser.

Explanation of the above options:
- `-d` Detached mode (not running in the foreground of your terminal)
- `-p` The port that should be exposed, and the port it should be mapped to in your host system `[host-port]:[container-port]`, leave the container port as `8080`
- `-v` Mounts the host directory containing your `conf.yml` (and any other assets) into the container at `/app/user-data`
- `--name` Give your container a human-readable name
- `--restart=always` Spin up the container when the daemon starts, or after it has been stopped
- `lissy93/dashy:latest` The image to run. Replace `:latest` with a specific version from the [tags](https://hub.docker.com/r/lissy93/dashy/tags) if needed

For all available options, and to learn more, see the [Docker Run Docs](https://docs.docker.com/engine/reference/commandline/run/)

Dashy is also available through GHCR: `docker pull ghcr.io/lissy93/dashy:latest`

The `latest` image is multi-arch, so the same tag works on amd64, arm64, and arm/v7 (Raspberry Pi 2+). Docker selects the right variant for your host automatically.

The image defaults to `:latest`, but you can instead specify a specific version, e.g. `docker pull lissy93/dashy:4.0.0`

---

## Using Docker Compose

Using Docker Compose can be useful for saving your specific config in files, without having to type out a long run command each time. Save compose config as a YAML file, and then run `docker compose up -d` (optionally use the `-f` flag to specify file location, if it isn't located at `./docker-compose.yml`), `-d` is detached mode (not running in the foreground of your terminal). Compose is also useful if you are using clusters, as the format is very similar to stack files, used with Docker Swarm.

The following is a complete example of a [`docker-compose.yml`](https://github.com/Lissy93/dashy/blob/master/docker-compose.yml) for Dashy. Run it as is, or uncomment the additional options you need.

```yaml
services:
  dashy:
    # The image to pull + version. Can use `ghcr.io/lissy93/dashy` instead
    image: lissy93/dashy:latest
    # Optional container name
    container_name: dashy
    # Port to serve on (keep container port (second one) as 8080)
    ports:
      - 8080:8080
    # Mount a directory containing your conf.yml and any other assets
    volumes:
      - ./user-data:/app/user-data
    # Add any env vars for server here, if needed
    environment:
      - NODE_ENV=production
    # Auto-start the container on boot
    restart: unless-stopped
    # Healthcheck to determine when container healthy
    healthcheck:
      test: ['CMD', 'node', '/app/services/healthcheck.js']
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 30s
```

To pull from GHCR instead of Docker Hub, set `image: ghcr.io/lissy93/dashy:latest`.

---

## Podman

[Podman](https://podman.io/) is a drop-in replacement for Docker that runs containers without a daemon and doesn't require root. If you're on Fedora, RHEL, or just prefer daemonless containers, Podman works with the same images and mostly the same CLI.

```bash
podman run -d \
  -p 8080:8080 \
  -v /path/to/your/user-data:/app/user-data:Z \
  --name dashy \
  --restart=always \
  docker.io/lissy93/dashy:latest
```

The `:Z` suffix on the volume mount handles SELinux relabeling, which you'll need on Fedora/RHEL. If you're not using SELinux, you can leave it off.

Podman also supports `podman-compose` or `podman compose` (with the compose plugin) using the same `docker-compose.yml` file shown above.

---

## Portainer

If you manage your Docker host through [Portainer](https://www.portainer.io/), you can deploy Dashy from its UI:

1. Go to Stacks > Add stack
2. Paste the [docker-compose.yml](https://github.com/Lissy93/dashy/blob/master/docker-compose.yml) contents, or point to the URL
3. Adjust the port and volume mappings as needed
4. Deploy the stack

Alternatively, go to Containers > Add container and use the image `lissy93/dashy:latest` with port `8080` mapped.

---

## Kubernetes

@vyrtualsynthese has written a Helm Chart for deploying with Kubernetes, available [here](https://github.com/vyrtualsynthese/selfhosted-helmcharts/tree/main/charts/dashy)

---

## Unraid

Dashy is available through the [Community Applications](https://forums.unraid.net/topic/38582-plug-in-community-applications/) plugin. Search for "Dashy" in the Apps tab and install from there. The template pre-fills the Docker image, port mapping, and volume paths for you.

If you'd prefer to set it up manually, go to Docker > Add Container and use `lissy93/dashy:latest` as the repository. Map port `8080`, and add a path mapping for the host directory containing your `conf.yml` to `/app/user-data`.

---

## Home Server Platforms

Several self-hosting platforms include Dashy in their app stores, giving you a one-click install with a management UI:

- [CasaOS](https://casaos.io/) - Has Dashy in its built-in app store
- [Cosmos Cloud](https://cosmos-cloud.io/) - Install Dashy from the marketplace
- [Umbrel](https://umbrel.com/) - Available in the Umbrel App Store
- [Runtipi](https://runtipi.io/) - Available in the Runtipi App Store

These all run Dashy as a Docker container under the hood, so configuration works the same way. You'll find your `conf.yml` in whichever directory the platform maps to `/app/user-data/`.

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
  -v /volume1/docker/dashy:/app/user-data \
  --name dashy \
  --restart=always \
  lissy93/dashy:latest
```

(Place your `conf.yml` and any sub-configs / icons / assets inside `/volume1/docker/dashy` on the host.)

dashy should be up within 1-2min after you've started the install task procedure

---

## Build from Source

If you do not want to use Docker, you can run Dashy directly on your host system. For this, you will need both [git](https://git-scm.com/downloads) and the latest or LTS version of [Node.js](https://nodejs.org/) installed, and optionally [yarn](https://yarnpkg.com/)

1. Get Code: `git clone https://github.com/Lissy93/dashy.git` and `cd dashy`
2. Configuration: Fill in your settings in `./user-data/conf.yml`
3. Install dependencies: `yarn`
4. Build: `yarn build`
5. Run: `yarn start`

---

## Deploy to Cloud Service

Dashy can be deployed to most cloud providers. The Docker guides above work on any VPS, but these providers offer quicker setup for static or containerized deployments.

> [!NOTE]
> Static hosting providers (Netlify, Vercel, EdgeOne) won't have status checks or config writing to disk, since those features need Dashy's Node server. Everything else works fine.

### Netlify

[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify&logoColor=white)](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy)

Dashy includes a [`netlify.toml`](https://github.com/Lissy93/dashy/blob/master/netlify.toml) so deployment works out of the box. [Netlify](https://www.netlify.com/) is free for personal use, supports custom domains, and deploys automatically from your Git repo.

Deploy link: `https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy`

### Vercel

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/new/project?template=https://github.com/lissy93/dashy)

[Vercel](https://vercel.com/) hosts static frontends with a generous free tier, custom domains, and built-in analytics.

Deploy link: `https://vercel.com/new/project?template=https://github.com/lissy93/dashy`

### Easypanel

[![Deploy to Easypanel](https://img.shields.io/badge/Deploy-Easypanel-5765F2?logo=data:image/svg+xml;base64,&logoColor=white)](https://easypanel.io/docs/templates/dashy)

[Easypanel](https://easypanel.io) is a self-hosted server control panel with a Dashy template. It runs the full Docker image, so all features including the Node server work.

Template: `https://easypanel.io/docs/templates/dashy`

### EdgeOne Pages

[![Deploy to EdgeOne](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https://github.com/lissy93/dashy)

[EdgeOne Pages](https://pages.edgeone.ai) is Tencent's edge hosting platform. Static deploy from your Git repo.

Deploy link: `https://edgeone.ai/pages/new?repository-url=https://github.com/lissy93/dashy`

### Play-with-Docker

[![Try in PWD](https://img.shields.io/badge/Try-Play_with_Docker-0db7ed?logo=docker&logoColor=white)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)

[Play with Docker](https://labs.play-with-docker.com/) gives you a free, temporary Docker environment in the browser. Good for trying Dashy without installing anything. Sessions last 4 hours.

URL: `https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml`

---

## Hosting with CDN

Once Dashy has been built, it is effectively just a static web app. This means that it can be served up with pretty much any static host, CDN or web server. To host Dashy through a CDN, the steps are very similar to building from source: clone the project, cd into it, install dependencies, write your config file and build the app. Once build is complete you will have a `./dist` directory within Dashy's root, and this is the build application which is ready to be served up.

However without Dashy's node server, there are a couple of features that will be unavailable to you, including: writing config changes to disk through the UI, and application status checks. Everything else will work fine.

---

## Requirements

### System Requirements

Dashy works well on a Raspberry Pi (tested on Pi 3 and later), but should also run well on any system.

### Docker

The initial build causes a spike in resource usage, but once running it's fairly steady. Minimum 1GB memory and 1GB disk space.

### Bare Metal

Requires [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/). The `engines` field in `package.json` specifies `>=18.0.0`, but the Docker image is built and tested on Node 24, so that's the recommended version for bare-metal too.

Minimum 512MB memory, 2GB disk space.

### CDN / Cloud Deploy

No specific requirements. The built app (without the Node server) is very lightweight and can be served by any static host or CDN. If you're using custom icons or other assets, additional disk space will be needed.

### Browser Support

JavaScript is required. Dashy targets browsers with >1% global usage and the last 2 versions of each (via [browserslist](https://browsersl.ist/)). In practice, any modern browser works fine. Internet Explorer is not supported.

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome / Chromium | 90+ | Fully supported |
| Firefox | 90+ | Fully supported |
| Edge | 90+ | Fully supported |
| Safari | 14+ | Supported |
| Opera | 76+ | Supported |
| Samsung Internet | 15+ | Supported |
| Firefox ESR | Latest | Supported |
| Internet Explorer | - | Not supported |
