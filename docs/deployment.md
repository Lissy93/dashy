# Deployment

- [Running the App](#running-the-app)
  - [Deploy with Docker](#deploy-with-docker)
  - [Deploy from Source](#deploy-from-source)
  - [Deploy to Cloud Service](#deploy-to-cloud-service)
- [Usage](#usage) 
  - [Providing Assets](#providing-assets)
  - [Basic Commands](#basic-commands)
  - [Healthchecks](#healthchecks)
  - [Monitoring](#logs-and-performance)
- [Updating](#updating)
  - [Updating Docker Container](#updating-docker-container)
  - [Automating Docker Updates](#automatic-docker-updates)
  - [Updating from Source](#updating-dashy-from-source)
- [Web Server Configuration](#web-server-configuration)
  - [NGINX](#nginx)
  - [Apache](#apache)

## Running the App

### Deploy with Docker

The quickest way to get started on any system is with Docker, and Dashy is available though [Docker Hub](https://hub.docker.com/r/lissy93/dashy). You will need [Docker](https://docs.docker.com/get-docker/) installed on your system.

To configure Dashy with your own services, and customize it to your liking, you will need to write a config file, and pass it to the Docker container as a volume. 

```docker
docker run -d \
  -p 8080:80 \
  -v /root/my-local-conf.yml:/app/public/conf.yml \
  --name my-dashboard \
  --restart=always \
  lissy93/dashy:latest
```

Explanation of the above options:
- `-d` Detached mode (not running in the foreground of your terminal)
- `-p` The port that should be exposed, and the port it should be mapped to in your host system `[host-port][container-port]`
- `-v` Specify volumes, to pass data from your host system to the container, in the format of `[host-path]:[container-path]`
- `--name` Give your container a human-readable name
- `--restart=always` Spin up the container when the daemon starts, or after it has been stopped
- `lissy93/dashy:latest` This last option is the image the container should be built from

For all available options, and to learn more, see the [Docker Run Docs](https://docs.docker.com/engine/reference/commandline/run/)

You can also build and deploy the Docker container from source.
- Get the code: `git clone git@github.com:Lissy93/dashy.git && cd dashy`
- Edit the `./public/conf.yml` file and take a look at the `docker-compose.yml`
- Start the container: `docker compose up`


### Deploy from Source
If you do not want to use Docker, you can run Dashy directly on your host system. For this, you will need both [git](https://git-scm.com/downloads) and the latest or LTS version of [Node.js](https://nodejs.org/) installed.

1. Get Code: `git clone git@github.com:Lissy93/dashy.git` and `cd dashy`
2. Configuration: Fill in you're settings in `./public/conf.yml`
3. Install dependencies: `yarn`
4. Build: `yarn build`
5. Run: `yarn start`

### Deploy to Cloud Service

Dashy supports 1-Click deployments on several popular cloud platforms.

#### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy)

[Netlify](https://www.netlify.com/) offers Git-based serverless cloud hosting for web applications. Their services are free to use for personal use, and they support deployment from both public and private repos, as well as direct file upload. The free plan also allows you to use your own custom domain or sub-domain, and is easy to setup.

To deploy Dashy to Netlify, use the following link
```
https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy
```

#### Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Lissy93/dashy)

[Heroku](https://www.heroku.com/) is a fully managed cloud platform as a service. You define app settings in a Procfile and app.json, which specifying how the app should be build and how the server should be started. Heroku is free to use for unlimited, non-commercial, single dyno apps, and supports custom domains. Heroku's single-dyno service is not as quite performant as some other providers, and the app will have a short wake-up time when not visited for a while

To deploy Dashy to Heroku, use the following link
```
https://heroku.com/deploy?template=https://github.com/Lissy93/dashy
```

#### Cloudflare Workers
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/lissy93/dashy/tree/deploy_cloudflare)

[Cloudflare Workers](https://workers.cloudflare.com/) is a simple yet powerful service for running cloud functions and hosting web content. It requires a Cloudflare account, but is completely free for smaller projects, and very reasonably priced ($0.15/million requests per month) for large applications. You can use your own domain, and applications are protected with Cloudflare's state of the art DDoS protection. For more info, see the docs on [Worker Sites](https://developers.cloudflare.com/workers/platform/sites)

To deploy Dashy to Cloudflare, use the following link
```
https://deploy.workers.cloudflare.com/?url=https://github.com/lissy93/dashy/tree/deploy_cloudflare
```

#### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/lissy93/dashy)

[Vercel](https://vercel.com/) is a performance-focused platform for hosting static frontend apps. It comes bundled with some useful tools for monitoring and anaylzing application performance and other metrics. Vercel is free for personal use, allows for custom domains and has very reasonable limits.

To deploy Dashy to Vercel, use the following link
```
https://vercel.com/new/project?template=https://github.com/lissy93/dashy
```

#### Deploy to DigitalOcean
[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/lissy93/dashy/tree/deploy_digital-ocean&refcode=3838338e7f79)

[DigitalOcan](https://www.digitalocean.com/) is a cloud service providing affordable developer-friendly virtual machines from $5/month. But they also have an app platform, where you can run web apps, static sites, APIs and background workers. CDN-backed static sites are free for personal use.

```
https://cloud.digitalocean.com/apps/new?repo=https://github.com/lissy93/dashy/tree/deploy_digital-ocean
```

#### Platform.sh
[![Deploy to Platform.sh](https://platform.sh/images/deploy/deploy-button-lg-blue.svg)](https://console.platform.sh/projects/create-project/?template=https://github.com/lissy93/dashy&utm_campaign=deploy_on_platform?utm_medium=button&utm_source=affiliate_links&utm_content=https://github.com/lissy93/dashy)

[Platform.sh](https://platform.sh) is an end-to-end solution for developing and deploying applications. It is geared towards enterprise users with large teams, and focuses on allowing applications to scale up and down. Unlike the above providers, Platform.sh is not free, although you can deploy a test app to it without needing a payment method

To deploy Dashy to Platform.sh, use the following link
```
https://console.platform.sh/projects/create-project/?template=https://github.com/lissy93/dashy
```

#### Deploy to Scalingo
[![Deploy on Scalingo](https://cdn.scalingo.com/deploy/button.svg)](https://my.scalingo.com/deploy?source=https://github.com/lissy93/dashy#master)

[Scalingo](https://scalingo.com/) is a scalable container-based cloud platform as a service. It's focus is on compliance and uptime, and is geared towards enterprise users. Scalingo is also not free, although they do have a 3-day free trial that does not require a payment method 

To deploy Dashy to Scalingo, use the following link
```
https://my.scalingo.com/deploy?source=https://github.com/lissy93/dashy#master
```

#### Play-with-Docker
[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/cff22438/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)

[Play with Docker](https://labs.play-with-docker.com/) is a community project by Marcos Liljedhal and Jonathan Leibiusky and sponsored by Docker, intended to provide a hands-on learning environment. Their labs let you quickly spin up a Docker container or stack, and test out the image in a temporary, sandboxed environment. There's no need to sign up, and it's completely free.

To run Dashy in PWD, use the following URL:
```
https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml
```

#### Surge.sh
[Surge.sh](http://surge.sh/) is quick and easy static web publishing platform for frontend-apps.

Surge supports [password-protected projects](https://surge.sh/help/adding-password-protection-to-a-project). You can also [add a custom domain](https://surge.sh/help/adding-a-custom-domain) and then [force HTTPS by default](https://surge.sh/help/using-https-by-default) and optionally [set a custom SSL certificate](https://surge.sh/help/securing-your-custom-domain-with-ssl)

To deploy Dashy to Surge.sh, first clone and cd into Dashy, install dependencies, and then use the following commands
```
yarn add -g surge
yarn build
surge ./dist
```

**[⬆️ Back to Top](#deployment)**

---

## Usage
### Providing Assets
Although not essential, you will most likely want to provide several assets to Dashy. All web assets can be found in the `/public` directory.

- `./public/conf.yml` - As mentioned, this is your main application config file
- `./public/item-icons` - If you're using your own icons, you can choose to store them locally for better load time, and this is the directory to put them in. You can also use sub-folders here to keep things organized. You then reference these assets relative this the direcroties path, for example: to use `./public/item-icons/networking/netdata.png` as an icon for one of your links, you would set `icon: networking/netdata.png`
- Also within `./public` you'll find standard website assets, including `favicon.ico`, `manifest.json`, `robots.txt`, etc. There's no need to modify these, but you can do so if you wish.

### Basic Commands

Now that you've got Dashy running, there are a few commands that you need to know.

The following commands are defined in the [`package.json`](https://github.com/Lissy93/dashy/blob/master/package.json#L5) file, and are run with `yarn`. If you prefer, you can use NPM, just replace instances of `yarn` with `npm run`. If you are using Docker, then you will need to precede each command with `docker exec -it [container-id]`, where container ID can be found by running `docker ps`. For example `docker exec -it 26c156c467b4 yarn build`.

- **`yarn build`** - In the interest of speed, the application is pre-compiled, this means that the config file is read during build-time, and therefore the app needs to rebuilt for any new changes to take effect. Luckily this is very straight forward. Just run `yarn build` or `docker exec -it [container-id] yarn build`
- **`yarn validate-config`** - If you have quite a long configuration file, you may wish to check that it's all good to go, before deploying the app. This can be done with `yarn validate-config` or `docker exec -it [container-id] yarn validate-config`. Your config file needs to be in `/public/conf.yml` (or within your Docker container at `/app/public/conf.yml`). This will first check that your YAML is valid, and then validates it against Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.js).
- **`yarn health-check`** - Checks that the application is up and running on it's specified port, and outputs current status and response times. Useful for integrating into your monitoring service, if you need to maintain high system availability
- **`yarn build-watch`** - If you find yourself making frequent changes to your configuration, and do not want to have to keep manually rebuilding, then this option is for you. It will watch for changes to any files within the projects root, and then trigger a rebuild. Note that if you are developing new features, then `yarn dev` would be more appropriate, as it's significantly faster at recompiling (under 1 second), and has hot reloading, linting and testing integrated
- **`yarn build-and-start`** - Builds the app, runs checks and starts the production server. Commands are run in parallel, and so is faster than running them in independently
- **`yarn pm2-start`** - Starts the Node server using [PM2](https://pm2.keymetrics.io/), a process manager for Node.js applications, that helps them stay alive. PM2 has some built-in basic monitoring features, and an optional [management solution](https://pm2.io/). If you are running the app on bare metal, it is recommended to use this start command

### Healthchecks

Healthchecks are configured to periodically check that Dashy is up and running correctly on the specified port. By default, the health script is called every 5 minutes, but this can be modified with the `--health-interval` option. You can check the current container health with: `docker inspect --format "{{json .State.Health }}" [container-id]`, and a summary of health status will show up under `docker ps`. You can also manually request the current application status by running `docker exec -it [container-id] yarn health-check`. You can disable healthchecks altogether by adding the `--no-healthcheck` flag to your Docker run command.

To restart unhealthy containers automatically, check out [Autoheal](https://hub.docker.com/r/willfarrell/autoheal/). This image watches for unhealthy containers, and automatically triggers a restart. This is a stand in for Docker's `--exit-on-unhealthy` that was proposed, but [not merged](https://github.com/moby/moby/pull/22719).

### Logs and Performance

You can view logs for a given Docker container with `docker logs [container-id]`, add the `--follow` flag to stream the logs. For more info, see the [Logging Documentation](https://docs.docker.com/config/containers/logging/). There's also [Dozzle](https://dozzle.dev/), a useful tool, that provides a web interface where you can stream and query logs from all your running containers from a single web app.

You can check the resource usage for your running Docker containers with `docker stats` or `docker stats [container-id]`. For more info, see the [Stats Documentation](https://docs.docker.com/engine/reference/commandline/stats/). There's also [cAdvisor](https://github.com/google/cadvisor), a useful web app for viewing and analyzing resource usage and performance of all your running containers.

You can also view logs, resource usage and other info as well as manage your Docker workflow in third-party Docker management apps. For example [Portainer](https://github.com/portainer/portainer) an all-in-one management web UI  for Docker and Kubernetes, or [LazyDocker](https://github.com/jesseduffield/lazydocker) a terminal UI for Docker container management and monitoring.

**[⬆️ Back to Top](#deployment)**

---
## Updating

Dashy is under active development, so to take advantage of the latest features, you may need to update your instance every now and again.

### Updating Docker Container
1. Pull latest image: `docker pull lissy93/dashy:latest`
2. Kill off existing container
	- Find container ID: `docker ps`
	- Stop container: `docker stop [container_id]`
	- Remove container: `docker rm [container_id]`
3. Spin up new container: `docker run [params] lissy93/dashy`

### Automatic Docker Updates

You can automate the above process using [Watchtower](https://github.com/containrrr/watchtower).
Watchtower will watch for new versions of a given image on Docker Hub, pull down your new image, gracefully shut down your existing container and restart it with the same options that were used when it was deployed initially.

To get started, spin up the watchtower container:

```
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower
```

For more information, see the [Watchtower Docs](https://containrrr.dev/watchtower/)

### Updating Dashy from Source
1. Navigate into directory: `cd ./dashy`
2. Stop your current instance
3. Pull latest code: `git pull origin master`
4. Re-build: `yarn build`
5. Start: `yarn start`

**[⬆️ Back to Top](#deployment)**

---

## Web Server Configuration

_The following section only applies if you are not using Docker, and would like to use your own web server_

Dashy ships with a pre-configured Node.js server, in [`server.js`](https://github.com/Lissy93/dashy/blob/master/server.js) which serves up the contents of the `./dist` directory on a given port. You can start the server by running `node server`. Note that the app must have been build (run `yarn build`), and you need [Node.js](https://nodejs.org) installed.

If you wish to run Dashy from a sub page (e.g. `example.com/dashy`), then just set the `BASE_URL` environmental variable to that page name (in this example, `/dashy`), before building the app, and the path to all assets will then resolve to the new path, instead of `./`.

However, since Dashy is just a static web application, it can be served with whatever server you like. The following section outlines how you can configure a web server.
### NGINX

Create a new file in `/etc/nginx/sites-enabled/dashy`

```
server {
	listen 80;
	listen [::]:80;

	root /var/www/dashy/html;
	index index.html;

	server_name your-domain.com www.your-domain.com;

	location / {
		try_files $uri $uri/ =404;
	}
}
```
Then upload the build contents of Dashy's dist directory to that location.
For example: `scp -r ./dist/* [username]@[server_ip]:/var/www/dashy/html`

### Apache

Copy Dashy's dist folder to your apache server, `sudo cp -r ./dashy/dist /var/www/html/dashy`.

In your Apache config, `/etc/apche2/apache2.conf` add:
```
<Directory /var/www/html>
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```

Add a `.htaccess` file within `/var/www/html/dashy/.htaccess`, and add:
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

Then restart Apache, with `sudo systemctl restart apache2`

### cPanel
1. Login to your WHM
2. Open 'Feature Manager' on the left sidebar
3. Under 'Manage feature list', click 'Edit'
4. Find 'Application manager' in the list, enable it and hit 'Save'
5. Log into your users cPanel account, and under 'Software' find 'Application Manager'
6. Click 'Register Application', fill in the form using the path that Dashy is located, and choose a domain, and hit 'Save'
7. The application should now show up in the list, click 'Ensure dependencies', and move the toggle switch to 'Enabled'
8. If you need to change the port, click 'Add environmental variable', give it the name 'PORT', choose a port number and press 'Save'.
9. Dashy should now be running at your selected path an on a given port

**[⬆️ Back to Top](#deployment)**

---

## Authentication

Dashy has built-in authentication and login functionality. However, since this is handled on the client-side, if you are using Dashy in security-critical situations, it is recommended to use an alternate method for authentication, such as [Authelia](https://www.authelia.com/), a VPN or web server and firewall rules. For more info, see **[Authentication Docs](/docs/authentication.md)**.


**[⬆️ Back to Top](#deployment)**
