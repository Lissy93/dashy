# Management

## Contents
- [Providing Assets](#providing-assets)
- [Running Commands](#running-commands)
- [Healthchecks](#healthchecks)
- [Logs and Performance](#logs-and-performance)
- [Auto-Starting at Boot](#auto-starting-at-system-boot)
- [Securing](#securing)
- [Updating](#updating)
- [Backing Up](#backing-up)
- [Scheduling](#scheduling)
- [Managing Containers with Compose](#managing-containers-with-docker-compose)
- [Passing in Environmental Variables](#passing-in-environmental-variables)
- [Running a Modified Version of the App](#running-a-modified-version-of-the-app)
- [Web Server Configuration](#web-server-configuration)
- [Authentication](#authentication-1)

## Providing Assets
Although not essential, you will most likely want to provide several assets to your running app.

This is easy to do using [Docker Volumes](https://docs.docker.com/storage/volumes/), which lets you share a file or directory between your host system, and the container. Volumes are specified in the Docker run command, or Docker compose file, using the `--volume` or `-v` flags. The value of which consists of the path to the file / directory on your host system, followed by the destination path within the container. Fields are separated by a colon (`:`), and must be in the correct order. For example: `-v ~/alicia/my-local-conf.yml:/app/public/conf.yml`

In Dashy, commonly configured resources include:
- `./public/conf.yml` - Your main application config file
- `./public/item-icons` - A directory containing your own icons. This allows for offline access, and better performance than fetching from a CDN
- Also within `./public` you'll find standard website assets, including `favicon.ico`, `manifest.json`, `robots.txt`, etc. There's no need to pass these in, but you can do so if you wish
- `/src/styles/user-defined-themes.scss` - A stylesheet for applying custom CSS to your app. You can also write your own themes here.

## Running Commands

The project has a few commands that can be used for various tasks, you can find a list of these either in the [Developing Docs](/docs/developing.md#project-commands), or by looking at the [`package.json`](https://github.com/Lissy93/dashy/blob/master/package.json#L5). These can be used by running `yarn [command-name]`.

 If you're using Docker, then you'll need to execute them within the container. This can be done by preceding each command with `docker exec -it [container-id]`, where container ID can be found by running `docker ps`. For example `docker exec -it 26c156c467b4 yarn build`. You can also enter the container, with `docker exec -it [container-id] /bin/ash`, and navigate around it with normal Linux commands.

## Healthchecks

Healthchecks are configured to periodically check that Dashy is up and running correctly on the specified port. By default, the health script is called every 5 minutes, but this can be modified with the `--health-interval` option. You can check the current container health with: `docker inspect --format "{{json .State.Health }}" [container-id]`, and a summary of health status will show up under `docker ps`. You can also manually request the current application status by running `docker exec -it [container-id] yarn health-check`. You can disable healthchecks altogether by adding the `--no-healthcheck` flag to your Docker run command.

To restart unhealthy containers automatically, check out [Autoheal](https://hub.docker.com/r/willfarrell/autoheal/). This image watches for unhealthy containers, and automatically triggers a restart. (This is a stand in for Docker's `--exit-on-unhealthy` that was proposed, but [not merged](https://github.com/moby/moby/pull/22719)).

```
docker run -d \
    --name autoheal \
    --restart=always \
    -e AUTOHEAL_CONTAINER_LABEL=all \
    -v /var/run/docker.sock:/var/run/docker.sock \
    willfarrell/autoheal
```

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
Dashy has [basic authentication](/docs/authentication.md) built in, however at present this is handled on the front-end, and so where security is critical, it is recommended to use an alternative method. See [here](/docs/authentication.md#alternative-authentication-methods) for options regarding securing Dashy.


**[⬆️ Back to Top](#management)**

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
Stop your current instance of Dashy, then navigate into the source directory. Pull down the latest code, with `git pull origin master`, then update dependencies with `yarn`, rebuild with `yarn build`, and start the server again with `yarn start`.

**[⬆️ Back to Top](#management)**

---

## Backing Up

### Backing Up Containers

You can make a backup of any running container really easily, using [`docker commit`](https://docs.docker.com/engine/reference/commandline/commit/) and save it with [`docker export`](https://docs.docker.com/engine/reference/commandline/export/), to do so:
- First find the container ID, you can do this with `docker container ls`
- Now to create the snapshot, just run `docker commit -p [container-id] my-backup`
- Finally, to save the backup locally, run `docker save -o ~/dashy-backup.tar my-backup`
- If you want to push this to a container registry, run  `docker push my-backup:latest`

Note that this will not include any data in docker volumes, and the process here is a bit different. Since these files exist on your host system, if you have an existing backup solution implemented, you can incorporate and volume files within that system.

### Backing Up Volumes
[offen/docker-volume-backup](https://github.com/offen/docker-volume-backup) is a useful tool for periodic Docker volume backups, to any S3-compatible storage provider. It's run as a light-weight Docker container, and is easy to setup, and also supports GPG-encryption, email notification, and routing away older backups. 

To get started, create a docker-compose similar to the example below, and then start the container. For more info, check out their [documentation](https://github.com/offen/docker-volume-backup), which is very clear.

```yaml
version: '3'
services:
  backup:
    image: offen/docker-volume-backup:latest
    environment:
      BACKUP_CRON_EXPRESSION: "0 * * * *"
      BACKUP_PRUNING_PREFIX: backup-
      BACKUP_RETENTION_DAYS: 7
      AWS_BUCKET_NAME: backup-bucket
      AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE
      AWS_SECRET_ACCESS_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    volumes:
      - data:/backup/my-app-backup:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
volumes:
  data:
```

It's worth noting that this process can also be done manually, using the following commands:

Backup:
```
docker run --rm -v some_volume:/volume -v /tmp:/backup alpine tar -cjf /backup/some_archive.tar.bz2 -C /volume ./
```
Restore:
```
docker run --rm -v some_volume:/volume -v /tmp:/backup alpine sh -c "rm -rf /volume/* /volume/..?* /volume/.[!.]* ; tar -C /volume/ -xjf /backup/some_archive.tar.bz2"
```
### Dashy-Specific Backup
Since Dashy is open source, and freely available, providing you're configuration data is passed in as volumes, there shouldn't be any need to backup the main container. Your main config file, and any assets you're using should be kept backed up, preferably in at least two places, and you should ensure that you can easily restore from backup, if needed.

Dashy also has a built-in cloud backup feature, which is free for personal users, and will let you make and restore fully encrypted backups of your config directly through the UI. To learn more, see the [Cloud Backup Docs](/docs/backup-restore.md)

---

## Scheduling

If you need to periodically schedule the running of a given command on Dashy (or any other container), then a useful tool for doing so it [ofelia](https://github.com/mcuadros/ofelia). This runs as a Docker container and is really useful for things like backups, logging, updating, notifications, etc. Crons are specified using Go's crontab format, and a useful tool for visualizing this is [crontab.guru](https://crontab.guru/). I recommend combining this with [healthchecks](https://github.com/healthchecks/healthchecks) for easy monitoring of jobs, and failure notifications.

---

## Managing Containers with Docker Compose

When you have a lot of containers, it quickly becomes hard to manage when using the `docker run` command. The solution to this is [docker compose](https://docs.docker.com/compose/), a handy tool for defining all a containers run settings in a single YAML file, and then spinning up that container with a single short command - `docker compose up`. For example, check out [@abhilesh's docker compose collection](https://github.com/abhilesh/self-hosted_docker_setups)

You can use Dashy's default [`docker-compose.yml`](https://github.com/Lissy93/dashy/blob/master/docker-compose.yml) file as a template, and modify it according to your needs.

An example Docker compose, using the default base image from DockerHub, might look something like this:

```yaml
---
version: "3.8"
services:
  dashy:
    container_name: Dashy
    image: lissy93/dashy
    volumes:
      - /root/my-config.yml:/app/public/conf.yml
    ports:
      - 4000:80
    environment:
      - BASE_URL=/my-dashboard
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'node', '/app/services/healthcheck']
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## Passing in Environmental Variables

With Docker, you can define environmental variables under the `environment` section of your Docker compose file. 

Environmental variables are used to configure high-level settings, usually before the config file has been read. For a list of all supported env vars in Dashy, see [the developing docs](/docs/developing.md#environmental-variables), or the default [`.env`](https://github.com/Lissy93/dashy/blob/master/.env) file.

A common use case, is to run Dashy under a sub-page, instead of at the root of a URL (e.g. `https://my-homelab.local/dashy` instead of `https://dashy.my-homelab.local`). This is done by specifying the `BASE_URL` variable.

```yaml
environment:
  - BASE_URL=/dashy
```

You can also do the same thing with the docker run command, using the [`--env`](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file) flag

If you've got many environmental variables, you might find it useful to put them in a [`.env` file](https://docs.docker.com/compose/env-file/). Similarly, for Docker run you can use [`--env-file`](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file) if you'd like to pass in a file containing all your environmental variables.

---

## Running a Modified Version of the App

If you'd like to make any code changes to the app, and deploy your modified version, this section briefly explains how.

The first step is to fork the project on GitHub, and clone it to your local system. Next, install the dependencies (`yarn`), and start the development server (`yarn dev`) and visit `localhost:8080` in your browser. You can then make changes to the codebase, and see the live app update in real-time. Once you've finished, running `yarn build` will build the app for production, and output the assets into `./dist` which can then be deployed using a web server, CDN or the built-in Node server with `yarn start`. For more info on all of this, take a look at the [Developing Docs](/docs/developing.md).

You probably want to deploy your app with Docker, and this can be done as follows:

To build and deploy locally, first build the app with: `docker build -t dashy .`, and then start the app with `docker run -p 8080:80 --name my-dashboard dashy`.  Or modify the `docker-compose.yml` file, replacing `image: lissy93/dashy` with `build: .` and run `docker compose up`.

Your container should now be running, and will appear in the list when you run `docker container ls –a`. If you'd like to enter the container, run `docker exec -it [container-id] /bin/ash`.

You may wish to upload your image to a container registry for easier access. Note that if you choose to do this on a public registry, please name your container something other than just 'dashy', to avoid confusion with the official image.
You can push your build image, by running: `docker push ghcr.io/OWNER/IMAGE_NAME:latest`. You will first need to authenticate, this can be done by running `echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin`, where `CR_PAT` is an environmental variable containing a token generated from your GitHub account. For more info, see the [Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

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

**[⬆️ Back to Top](#management)**

---

## Authentication

Dashy has built-in authentication and login functionality. However, since this is handled on the client-side, if you are using Dashy in security-critical situations, it is recommended to use an alternate method for authentication, such as [Authelia](https://www.authelia.com/), a VPN or web server and firewall rules. For more info, see **[Authentication Docs](/docs/authentication.md)**.


**[⬆️ Back to Top](#management)**