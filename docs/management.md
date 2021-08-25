# Management

## Providing Assets
Although not essential, you will most likely want to provide several assets to Dashy. All web assets can be found in the `/public` directory.

- `./public/conf.yml` - As mentioned, this is your main application config file
- `./public/item-icons` - If you're using your own icons, you can choose to store them locally for better load time, and this is the directory to put them in. You can also use sub-folders here to keep things organized. You then reference these assets relative this the direcroties path, for example: to use `./public/item-icons/networking/netdata.png` as an icon for one of your links, you would set `icon: networking/netdata.png`
- Also within `./public` you'll find standard website assets, including `favicon.ico`, `manifest.json`, `robots.txt`, etc. There's no need to modify these, but you can do so if you wish.

## Basic Commands

Now that you've got Dashy running, there are a few commands that you need to know.

The following commands are defined in the [`package.json`](https://github.com/Lissy93/dashy/blob/master/package.json#L5) file, and are run with `yarn`. If you prefer, you can use NPM, just replace instances of `yarn` with `npm run`. If you are using Docker, then you will need to precede each command with `docker exec -it [container-id]`, where container ID can be found by running `docker ps`. For example `docker exec -it 26c156c467b4 yarn build`.

- **`yarn build`** - In the interest of speed, the application is pre-compiled, this means that the config file is read during build-time, and therefore the app needs to rebuilt for any new changes to take effect. Luckily this is very straight forward. Just run `yarn build` or `docker exec -it [container-id] yarn build`
- **`yarn validate-config`** - If you have quite a long configuration file, you may wish to check that it's all good to go, before deploying the app. This can be done with `yarn validate-config` or `docker exec -it [container-id] yarn validate-config`. Your config file needs to be in `/public/conf.yml` (or within your Docker container at `/app/public/conf.yml`). This will first check that your YAML is valid, and then validates it against Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.js).
- **`yarn health-check`** - Checks that the application is up and running on it's specified port, and outputs current status and response times. Useful for integrating into your monitoring service, if you need to maintain high system availability
- **`yarn build-watch`** - If you find yourself making frequent changes to your configuration, and do not want to have to keep manually rebuilding, then this option is for you. It will watch for changes to any files within the projects root, and then trigger a rebuild. Note that if you are developing new features, then `yarn dev` would be more appropriate, as it's significantly faster at recompiling (under 1 second), and has hot reloading, linting and testing integrated
- **`yarn build-and-start`** - Builds the app, runs checks and starts the production server. Commands are run in parallel, and so is faster than running them in independently
- **`yarn pm2-start`** - Starts the Node server using [PM2](https://pm2.keymetrics.io/), a process manager for Node.js applications, that helps them stay alive. PM2 has some built-in basic monitoring features, and an optional [management solution](https://pm2.io/). If you are running the app on bare metal, it is recommended to use this start command

## Healthchecks

Healthchecks are configured to periodically check that Dashy is up and running correctly on the specified port. By default, the health script is called every 5 minutes, but this can be modified with the `--health-interval` option. You can check the current container health with: `docker inspect --format "{{json .State.Health }}" [container-id]`, and a summary of health status will show up under `docker ps`. You can also manually request the current application status by running `docker exec -it [container-id] yarn health-check`. You can disable healthchecks altogether by adding the `--no-healthcheck` flag to your Docker run command.

To restart unhealthy containers automatically, check out [Autoheal](https://hub.docker.com/r/willfarrell/autoheal/). This image watches for unhealthy containers, and automatically triggers a restart. This is a stand in for Docker's `--exit-on-unhealthy` that was proposed, but [not merged](https://github.com/moby/moby/pull/22719).

## Logs and Performance

#### Container Logs
You can view logs for a given Docker container with `docker logs [container-id]`, add the `--follow` flag to stream the logs. For more info, see the [Logging Documentation](https://docs.docker.com/config/containers/logging/). There's also [Dozzle](https://dozzle.dev/), a useful tool, that provides a web interface where you can stream and query logs from all your running containers from a single web app.

#### Container Performance
You can check the resource usage for your running Docker containers with `docker stats` or `docker stats [container-id]`. For more info, see the [Stats Documentation](https://docs.docker.com/engine/reference/commandline/stats/). There's also [cAdvisor](https://github.com/google/cadvisor), a useful web app for viewing and analyzing resource usage and performance of all your running containers.

#### Management Apps
You can also view logs, resource usage and other info as well as manage your entire Docker workflow in third-party Docker management apps. For example [Portainer](https://github.com/portainer/portainer) an all-in-one open source management web UI  for Docker and Kubernetes, or [LazyDocker](https://github.com/jesseduffield/lazydocker) a terminal UI for Docker container management and monitoring.

#### Advanced Logging and Monitoring
Docker supports using [Prometheus](https://prometheus.io/) to collect logs, which can then be visualized using a platform like [Grafana](https://grafana.com/). For more info, see [this guide](https://docs.docker.com/config/daemon/prometheus/). If you need to route your logs to a remote syslog, then consider using [logspout](https://github.com/gliderlabs/logspout). For enterprise-grade instances, there are managed services, that make monitoring container logs and metrics very easy, such as [Sematext](https://sematext.com/blog/docker-container-monitoring-with-sematext/) with [Logagent](https://github.com/sematext/logagent-js).

## Auto-Starting at System Boot

You can use Docker's [restart policies](https://docs.docker.com/engine/reference/run/#restart-policies---restart) to instruct the container to start after a system reboot, or restart after a crash. Just add the `--restart=always` flag to your Docker compose script or Docker run command. For more information, see the docs on [Starting Containers Automatically](https://docs.docker.com/config/containers/start-containers-automatically/).

For Podman, you can use `systemd` to create a service that launches your container, [the docs](https://podman.io/blogs/2018/09/13/systemd.html) explains things further. A similar approach can be used with Docker, if you need to start containers after a reboot, but before any user interaction.

To restart the container after something within it has crashed, consider using [`docker-autoheal`](https://github.com/willfarrell/docker-autoheal) by @willfarrell, a service that monitors and restarts unhealthy containers. For more info, see the [Healthchecks](#healthchecks) section above.

## Securing

#### SSL

Enabling HTTPS with an SSL certificate is recommended if you hare hosting Dashy anywhere other than your home. This will ensure that all traffic is encrypted in transit.

[Let's Encrypt](https://letsencrypt.org/docs/) is a global Certificate Authority, providing free SSL/TLS Domain Validation certificates in order to enable secure HTTPS access to your website. They have good browser/ OS [compatibility](https://letsencrypt.org/docs/certificate-compatibility/) with their ISRG X1 and DST CA X3 root certificates, support [Wildcard issuance](https://community.letsencrypt.org/t/acme-v2-production-environment-wildcards/55578) done via ACMEv2 using the DNS-01 and have [Multi-Perspective Validation](https://letsencrypt.org/2020/02/19/multi-perspective-validation.html). Let's Encrypt provide [CertBot](https://certbot.eff.org/) an easy app for generating and setting up an SSL certificate

[ZeroSSL](https://zerossl.com/) is another popular certificate issuer, they are free for personal use, and also provide easy-to-use tools for getting things setup.


If you're hosting Dashy behind Cloudflare, then they offer [free and easy SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-an-ssl-certificate/).

If you're not so comfortable on the command line, then you can use a tool like [SSL For Free](https://www.sslforfree.com/) to generate your Let's Encrypt or ZeroSSL certificate, and support shared hosting servers. They also provide step-by-step tutorials on setting up your certificate on most common platforms. If you are using shared hosting, you may find [this tutorial](https://www.sitepoint.com/a-guide-to-setting-up-lets-encrypt-ssl-on-shared-hosting/) helpful.

#### Authentication
Dashy has [basic authentication](/docs/authentication) built in, however at present this is handled on the front-end, and so where security is critical, it is recommended to use an alternative method. See [here](/docs/authentication#alternative-authentication-methods) for options regarding securing Dashy.


**[⬆️ Back to Top](#)**

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

**[⬆️ Back to Top](#)**

---

## Web Server Configuration

_The following section only applies if you are not using Docker, and would like to use your own web server_

Dashy ships with a pre-configured Node.js server, in [`server.js`](https://github.com/Lissy93/dashy/blob/master/server.js) which serves up the contents of the `./dist` directory on a given port. You can start the server by running `node server`. Note that the app must have been build (run `yarn build`), and you need [Node.js](https://nodejs.org) installed.

If you wish to run Dashy from a sub page (e.g. `example.com/dashy`), then just set the `BASE_URL` environmental variable to that page name (in this example, `/dashy`), before building the app, and the path to all assets will then resolve to the new path, instead of `./`.

However, since Dashy is just a static web application, it can be served with whatever server you like. The following section outlines how you can configure a web server.

Note, that if you choose not to use `server.js` to serve up the app, you will loose access to the following features:
- Loading page, while the app is building
- Writing config file to disk from the UI
- Website status indicators, and ping checks

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

**[⬆️ Back to Top](#)**

---

## Authentication

Dashy has built-in authentication and login functionality. However, since this is handled on the client-side, if you are using Dashy in security-critical situations, it is recommended to use an alternate method for authentication, such as [Authelia](https://www.authelia.com/), a VPN or web server and firewall rules. For more info, see **[Authentication Docs](/docs/authentication)**.


**[⬆️ Back to Top](#)**