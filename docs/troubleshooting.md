# Troubleshooting

> _**This document contains common problems and their solutions.**_
>
> _If you came across an issue where the solution was not immediately obvious, consider adding it to this list to help other users._

### Contents
- [Refused to Connect in Web Content View](#refused-to-connect-in-modal-or-workspace-view)
- [404 On Static Hosting](#404-on-static-hosting)
- [404 from Mobile Home Screen](#404-after-launch-from-mobile-home-screen)
- [Yarn Build or Run Error](#yarn-error)
- [Remote Config Not Loading](#remote-config-not-loading)
- [Heap limit Allocation failed](ineffective-mark-compacts-near-heap-limit-allocation-failed)
- [Command failed with signal "SIGKILL"](#command-failed-with-signal-sigkill)
- [Auth Validation Error: "should be object"](#auth-validation-error-should-be-object)
- [App Not Starting After Update to 2.0.4](#app-not-starting-after-update-to-204)
- [Keycloak Redirect Error](#keycloak-redirect-error)
- [Docker Directory Error](#docker-directory)
- [Config Not Updating](#config-not-updating)
- [Config Still not Updating](#config-still-not-updating)
- [Styles and Assets not Updating](#styles-and-assets-not-updating)
- [DockerHub toomanyrequests](#dockerhub-toomanyrequests)
- [Config Validation Errors](#config-validation-errors)
- [Node Sass unsupported environment](#node-sass-does-not-yet-support-your-current-environment)
- [Cannot find module './_baseValues'](#error-cannot-find-module-_basevalues)
- [Ngrok Invalid Host Headers](#invalid-host-header-while-running-through-ngrok)
- [Warnings in the Console during deploy](#warnings-in-the-console-during-deploy)
- [Docker Login Fails on Ubuntu](#docker-login-fails-on-ubuntu)
- [Status Checks Failing](#status-checks-failing)
- [Diagnosing Widget Errors](#widget-errors)
- [Fixing Widget CORS Errors](#widget-cors-errors)
- [Weather Forecast Widget 401](#weather-forecast-widget-401)
- [Font Awesome Icons not Displaying](#font-awesome-icons-not-displaying)
- [How-To Open Browser Console](#how-to-open-browser-console)
- [Git Contributions not Displaying](#git-contributions-not-displaying)


---

## `Refused to Connect` in Modal or Workspace View

This is not an issue with Dashy, but instead caused by the target app preventing direct access through embedded elements. 

As defined in [RFC-7034](https://datatracker.ietf.org/doc/html/rfc7034), for any web content to be accessed through an embedded element, it must have the [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) HTTP header set to `ALLOW`. If you are getting a `Refused to Connect` error then this header is set to `DENY` (or `SAMEORIGIN` and it's on a different host). Thankfully, for self-hosted services, it is easy to set these headers.

These settings are usually set in the config file for the web server that's hosting the target application, here are some examples of how to enable cross-origin access with common web servers:

### NGINX
In NGINX, you can use the [`add_header`](https://nginx.org/en/docs/http/ngx_http_headers_module.html) module within the app block.
```
server {
  ...
  add_header X-Frame-Options SAMEORIGIN always;
}
```
Then reload with `service nginx reload`

### Caddy

In Caddy, you can use the [`header`](https://caddyserver.com/docs/caddyfile/directives/header) directive.

```yaml
header {
  X-Frame-Options SAMEORIGIN
}
```

### Apache

In Apache, you can use the [`mod_headers`](https://httpd.apache.org/docs/current/mod/mod_headers.html) module to set the `X-Frame-Options` in your config file. This file is usually located somewhere like `/etc/apache2/httpd.conf

```
Header set X-Frame-Options: "ALLOW-FROM http://[dashy-location]/" 
```

### LightHttpd

```
Content-Security-Policy: frame-ancestors 'self' https://[dashy-location]/
```

---

## 404 On Static Hosting

If you're seeing Dashy's 404 page on initial load/ refresh, and then the main app when you go back to Home, then this is likely caused by the Vue router, and if so can be fixed in one of two ways. 

The first solution is to switch the routing mode, from HTML5 `history` mode to `hash` mode, by setting `appConfig.routingMode` to `hash`.

If this works, but you wish to continue using HTML5 history mode, then a bit of extra [server configuration](/docs/management.md#web-server-configuration) is required. This is explained in more detaail in the [Vue Docs](https://router.vuejs.org/guide/essentials/history-mode.html). Once completed, you can then use `routingMode: history` again, for neater URLs.

---

## 404 after Launch from Mobile Home Screen

Similar to the above issue, if you get a 404 after using iOS's “add to Home Screen” feature, then this is caused by Vue router.
It can be fixed by setting `appConfig.routingMode` to `hash`

See also: [#628](https://github.com/Lissy93/dashy/issues/628)

---

## Yarn Error

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

---

## Remote Config Not Loading

If you've got a multi-page dashboard, and are hosting the additional config files yourself, then CORS rules will apply. A CORS error will look something like:

```
Access to XMLHttpRequest at 'https://example.com/raw/my-config.yml' from origin 'http://dashy.local' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

The solution is to add the appropriate headers onto the target server, to allow it to accept requests from the origin where you're running Dashy.

If it is a remote service, that you do not have admin access to, then another option is to proxy the request. Either host your own, or use a publicly accessible service, like [allorigins.win](https://allorigins.win), e.g: `https://api.allorigins.win/raw?url=https://pastebin.com/raw/4tZpaJV5`. For git-based services specifically, there's [raw.githack.com](https://raw.githack.com/)

---

##  Ineffective mark-compacts near heap limit Allocation failed

If you see an error message, similar to:

```
<--- Last few GCs --->

[61:0x74533040] 229060 ms: Mark-sweep (reduce) 127.1 (236.9) -> 127.1 (137.4) MB, 5560.7 / 0.3 ms (average mu = 0.286, current mu = 0.011) allocation failure scavenge might not succeed

<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```


This is likely caused by insufficient memory allocation to the container. When the container first starts up, or has to rebuild, the memory usage spikes, and if there isn't enough memory, it may terminate. This can be specified with, for example: `--memory=1024m`. For more info, see [Docker: Runtime options with Memory, CPUs, and GPUs](https://docs.docker.com/config/containers/resource_constraints/).

See also: [#380](https://github.com/Lissy93/dashy/issues/380), [#350](https://github.com/Lissy93/dashy/issues/350), [#297](https://github.com/Lissy93/dashy/issues/297), [#349](https://github.com/Lissy93/dashy/issues/349), [#510](https://github.com/Lissy93/dashy/issues/510) and [#511](https://github.com/Lissy93/dashy/issues/511)

---

## Command failed with signal "SIGKILL"

In Docker, this can be caused by not enough memory. When the container first starts up, or has to rebuild, the memory usage spikes, and so a larger allocation may be required. This can be specified with, for example: `--memory=1024m`. For more info, see [Docker: Runtime options with Memory, CPUs, and GPUs](https://docs.docker.com/config/containers/resource_constraints/)

See also [#624](https://github.com/Lissy93/dashy/issues/624)

---

## Auth Validation Error: "should be object"

In V 1.6.5 an update was made that in the future will become a breaking change. You will need to update you config to reflect this before V 2.0.0 is released. In the meantime, your previous config will continue to function normally, but you will see a validation warning. The change means that the structure of the `appConfig.auth` object is now an object, which has a `users` property.

For more info, see [this announcement](https://github.com/Lissy93/dashy/discussions/177).

You can fix this by replacing:

```yaml
auth:
- user: xxx
  hash: xxx
```

with

```yaml
auth:
  users:
  - user: xxx
    hash: xxx
```

---

## App Not Starting After Update to 2.0.4

Version 2.0.4 introduced changes to how the config is read, and the app is build. If you were previously mounting `/public` as a volume, then this will over-write the build app, preventing it from starting. The solution is to just pass in the file(s) / sub-directories that you need. For example:

```yaml
volumes:
- /srv/dashy/conf.yml:/app/public/conf.yml
- /srv/dashy/item-icons:/app/public/item-icons
```

---

## Keycloak Redirect Error

Check the [browser's console output](#how-to-open-browser-console), if you've not set any headers, you will likely see a CORS error here, which would be the source of the issue.

You need to allow Dashy to make requests to Keycloak, and Keycloak to redirect to Dashy. The way you do this depends on how you're hosting these applications / which proxy you are using, and examples can be found in the [Management Docs](/docs/management.md#setting-headers).

For example, add the access control header to Keycloak, like:

`Access-Control-Allow-Origin [URL-of Dashy]`

Note that for requests that transport sensitive info like credentials, setting the accept header to a wildcard (`*`) is not allowed - see [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials), so you will need to specify the actual URL.

You should also ensure that Keycloak is correctly configured, with a user, realm and application, and be sure that you have set a valid redirect URL in Keycloak ([screenshot](https://user-images.githubusercontent.com/1862727/148599768-db4ee4f8-72c5-402d-8f00-051d999e6267.png)).

For more details on how to set headers, see the [Example Headers](/docs/management.md#setting-headers) in the management docs, or reference the documentation for your proxy.

If you're running in Kubernetes, you will need to enable CORS ingress rules, see [docs](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#enable-cors), e.g:

```
nginx.ingress.kubernetes.io/cors-allow-origin: "https://dashy.example.com"
nginx.ingress.kubernetes.io/enable-cors: "true"
```

See also: #479, #409, #507, #491, #341, #520

---

## Docker Directory

```
Error response from daemon: OCI runtime create failed: container_linux.go:380:
starting container process caused: process_linux.go:545: container init caused:
rootfs_linux.go:76: mounting "/home/ubuntu/my-conf.yml" to rootfs at 
"/app/public/conf.yml" caused: mount through procfd: not a directory: 
unknown: Are you trying to mount a directory onto a file (or vice-versa)?
Check if the specified host path exists and is the expected type.
```

If you get an error similar to the one above, you are mounting a directory to the config file's location, when a plain file is expected. Create a YAML file, (`touch my-conf.yml`), populate it with a sample config, then pass it as a volume: `-v ./my-local-conf.yml:/app/public/conf.yml` 

---

## Config Not Updating

Dashy has the option to save settings and config locally, in browser storage. Anything here will take precedence over whatever is in your config file, sometimes with unintended consequences. If you've updated the config file manually, and are not seeing changes reflected in the UI, then try visiting the site in Incognito mode. If that works, then the solution is just to clear local storage. This can be done from the config menu, under "Clear Local Settings".

---

## Config Still not Updating

Sometimes your text editor updates files [inode](https://linuxhandbook.com/inode-linux/), meaning changes will not be picked up by the Docker container. This [article](https://medium.com/@jonsbun/why-need-to-be-careful-when-mounting-single-files-into-a-docker-container-4f929340834) explains things further.

---

## Styles and Assets not Updating

If you find that your styles and other visual assets work when visiting `ip:port` by not `dashy.domain.com`, then this is usually caused by caching. In your browser, do a hard-refresh (<kbd>Ctrl</kbd> + <kbd>F5</kbd>). If you use Cloudflare, then you can clear the cache through the management console, or set the cache level to Bypass for certain files, under the Rules tab.

---

## DockerHub `toomanyrequests`

This situation relates to error messages similar to one of the following, returned when pulling, updating or running the Docker container from Docker Hub.

```
Continuing execution. Pulling image lissy93/dashy:release-1.6.0 
error pulling image configuration: toomanyrequests
```
or
```
You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit
```

When DockerHub returns one of these errors, or a `429` status, that means you've hit your rate limit. This was [introduced](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/) last year, and prevents unauthenticated or free users from running docker pull more than 100 times per 6 hours.
You can [check your rate limit status](https://www.docker.com/blog/checking-your-current-docker-pull-rate-limits-and-status/) by looking for the `ratelimit-remaining` header in any DockerHub responses. 

#### Solution 1 - Use an alternate container registry
- Dashy is also availible through GHCR, which at present does not have any hard limits. Just use `docker pull ghcr.io/lissy93/dashy:latest` to fetch the image
- You can also build the image from source, by cloning the repo, and running `docker build -t dashy .` or use the pre-made docker compose

#### Solution 2 - Increase your rate limits
- Logging in to DockerHub will increase your rate limit from 100 requests to 200 requests per 6 hour period
- Upgrading to a Pro for $5/month will increase your image requests to 5,000 per day, and any plans above have no rate limits
- Since rate limits are counted based on your IP address, proxying your requests, or using a VPN may work

---

## Config Validation Errors
The configuration file is validated against [Dashy's Schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json) using AJV.

First, check that your syntax is valid, using [YAML Validator](https://codebeautify.org/yaml-validator/) or [JSON Validator](https://codebeautify.org/jsonvalidator). If the issue persists, then take a look at the [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json), and verify that the field you are trying to add/ modify matches the required format. You can also use [this tool](https://www.jsonschemavalidator.net/s/JFUj7X9J) to validate your JSON config against the schema, or run `yarn validate-config`.

If you're trying to use a recently released feature, and are getting a warning, this is likely because you've not yet updated the the current latest version of Dashy.

If the issue still persists, you should raise an issue.

---

## Node Sass does not yet support your current environment
Caused by node-sass's binaries being built for a for a different architecture
To fix this, just run: `yarn rebuild node-sass`

---

## Error: Cannot find module './_baseValues'
Clearing the cache should fix this: `yarn cache clean`
If the issue persists, remove (`rm -rf node_modules\ yarn.lock`) and reinstall (`yarn`) node_modules

---

## Invalid Host Header while running through ngrok
Just add the [-host-header](https://ngrok.com/docs#http-host-header) flag, e.g. `ngrok http 8080 -host-header="localhost:8080"`

---

## Warnings in the Console during deploy
Please acknowledge the difference between errors and warnings before raising an issue about messages in the console. It's not unusual to see warnings about a new version of a certain package being available, an asset bundle bing oversized or a service worker not yet having a cache. These shouldn't have any impact on the running application, so please don't raise issues about these unless it directly relates to a bug or issue you're experiencing. Errors on the other hand should not appear in the console, and they are worth looking into further.

---

## Docker Login Fails on Ubuntu

Run `sudo apt install gnupg2 pass && gpg2 -k`

---

## Status Checks Failing
If you're using status checks, and despite a given service being online, the check is displaying an error, there are a couple of things you can look at:

If your service requires requests to include any authorization in the headers, then use the  `statusCheckHeaders` property, as described in the [docs](/docs/status-indicators.md#setting-custom-headers).

If you are still having issues, it may be because your target application is blocking requests from Dashy's IP. This is a [CORS error](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), and can be fixed by setting the headers on your target app, to include:
```
Access-Control-Allow-Origin: https://location-of-dashy/
Vary: Origin
```
If the URL you are checking has an unsigned certificate, or is not using HTTPS, then you may need to disable the rejection of insecure requests. This can be done by setting `statusCheckAllowInsecure` to true for a given item.

If your service is online, but responds with a status code that is not in the 2xx range, then you can use `statusCheckAcceptCodes` to set an accepted status code.

If you get an error, like `Service Unavailable: Server resulted in a fatal error`, even when it's definitely online, this is most likely caused by missing the protocol. Don't forget to include `https://` (or whatever protocol) before the URL, and ensure that if needed, you've specified the port.

Running Dashy in HOST network mode, instead of BRIDGE will allow status check access to other services in HOST mode. For more info, see [#445](https://github.com/Lissy93/dashy/discussions/445).

If you have firewall rules configured, then ensure that they don't prevent Dashy from making requests to the other services you are trying to access.

Currently, the status check needs a page to be rendered, so if this URL in your browser does not return anything, then status checks will not work. This may be modified in the future, but in the meantime, a fix would be to make your own status service, which just checks if your app responds with whatever code you'd like, and then return a 200 plus renders an arbitrary message. Then just point `statusCheckUrl` to your custom page.

For further troubleshooting, use an application like [Postman](https://postman.com) to diagnose the issue. Set the parameter to `GET`, and then make a call to: `https://[url-of-dashy]/status-check/?&url=[service-url]`. Where the service URL must have first been encoded (e.g. with `encodeURIComponent()` or [urlencoder.io](https://www.urlencoder.io/))

If you're serving Dashy though a CDN, instead of using the Node server or Docker image, then the Node endpoint that makes requests will not be available to you, and all requests will fail. A workaround for this may be implemented in the future, but in the meantime, your only option is to use the Docker or Node deployment method. 

---

## Widget Errors

#### Find Error Message
If an error occurs when fetching or rendering results, you will see a short message in the UI. If that message doesn't addequatley explain the problem, then you can [open the browser console](/docs/troubleshooting.md#how-to-open-browser-console) to see more details.

#### Check Config
Before proceeding, ensure that if the widget requires auth your API is correct, and for custom widgets, double check that the URL and protocol is correct.

#### Timeout Error
If the error message in the console includes: `Error: timeout of 500ms exceeded`, then your Glances endpoint is slower to respond than expected. You can fix this by [setting timeout](https://github.com/Lissy93/dashy/blob/master/docs/widgets.md#setting-timeout) to a larger value. This is done on each widget, with the `timeout` attribute, and is specified in ms. E.g. `timeout: 5000` would only fail if no response is returned within 5 seconds.

#### CORS error
If the console message mentions to corss-origin blocking, then this is a CORS error, see: [Fixing Widget CORS Errors](#widget-cors-errors)

#### More Info
If you're able to, you can find more information about why the request may be failing in the Dev Tools under the Network tab, and you can ensure your endpoint is correct and working using a tool like Postman.

---

## Widget CORS Errors

The most common widget issue is a CORS error. This is a browser security mechanism which prevents the client-side app (Dashy) from from accessing resources on a remote origin, without that server's explicit permission (e.g. with headers like Access-Control-Allow-Origin). See the MDN Docs for more info: [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

There are several ways to fix a CORS error:

#### Option 1 - Ensure Correct Protocol
You will get a CORS error if you try and access a http service from a https source. So ensure that the URL you are requesting has the right protocol, and is correctly formatted.

#### Option 2 - Set Headers

If you have control over the destination (e.g. for a self-hosted service), then you can simply apply the correct headers.
Add the `Access-Control-Allow-Origin` header, with the value of either `*` to allow requests from anywhere, or more securely, the host of where Dashy is served from. For example:

```
Access-Control-Allow-Origin: https://url-of-dashy.local
```

or

```
Access-Control-Allow-Origin: *
```

For more info on how to set headers, see: [Setting Headers](/docs/management.md#setting-headers) in the management docs

#### Option 3 - Proxying Request

You can route requests through Dashy's built-in CORS proxy. Instructions and more details can be found [here](/docs/widgets.md#proxying-requests). If you don't have control over the target origin, and you are running Dashy either through Docker, with the Node server or on Netlify, then this solution will work for you.

Just add the `useProxy: true` option to the failing widget.

#### Option 4 - Use a plugin

For testing purposes, you can use an addon, which will disable the CORS checks. You can get the Allow-CORS extension for [Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en-US) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/), more details [here](https://mybrowseraddon.com/access-control-allow-origin.html)

---

## Weather Forecast Widget 401

[Weather widget](/docs/widgets.md#weather-forecast) is working fine, but you are getting a `401` for the [Weather Forecast widget](/docs/widgets.md#weather-forecast), then this is most likely an OWM API key issue.

The forecasting API requires an upgraded plan. ULPT: You can get a free, premium API key by filling in [this form](https://home.openweathermap.org/students). It's a student plan, but there's no verification to check that you are still a student.

A future update will be pushed out, to use a free weather forecasting API.

---

## Font Awesome Icons not Displaying

Usually, Font Awesome will be automatically enabled if one or more of your icons are using Font-Awesome. If this is not happening, then you can always manually enable (or disable) Font Awesome by setting: [`appConfig`](/docs/configuring.md#appconfig-optional).`enableFontAwesome` to `true`.

If you are trying to use a premium icon, then you must have a [Pro License](https://fontawesome.com/plans). You'll then need to specify your Pro plan API key under `appConfig.fontAwesomeKey`. You can find this key, by logging into your FA account, navigate to Account → [Kits](https://fontawesome.com/kits) → New Kit → Copy Kit Code. The code is a 10-digit alpha-numeric code, and is also visible within the new kit's URL, for example: `81e48ce079`.

Be sure that you're specifying the icon category and name correctly. You're icon should look be `[category] fa-[icon-name]`. The following categories are supported: `far` _(regular)_, `fas` _(solid)_, `fal`_(light)_, `fad` _(duo-tone)_ and `fab`_(brands)_. With the exception of brands, you'll usually want all your icons to be in from same category, so they look uniform.

Ensure the icon you are trying to use, is available within [FontAwesome Version 5](https://fontawesome.com/v5/search).

Examples: `fab fa-raspberry-pi`, `fas fa-database`, `fas fa-server`, `fas fa-ethernet`

Finally, check the [browser console](#how-to-open-browser-console) for any error messages, and raise a ticket if the issue persists.

---

## How-To Open Browser Console
When raising a bug, one crucial piece of info needed is the browser's console output. This will help the developer diagnose and fix the issue.

If you've been asked for this info, but are unsure where to find it, then it is under the "Console" tab, in the browsers developer tools, which can be opened with <kbd>F12</kbd>. You can right-click the console, and select Save As to download the log.

To open dev tools, and jump straight to the console:
- Win / Linux: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd>
- MacOS: <kbd>Cmd</kbd> + <kbd>Option</kbd> + <kbd>J</kbd>

For more detailed walk through, see [this article](https://support.shortpoint.com/support/solutions/articles/1000222881-save-browser-console-file).

---

## Git Contributions not Displaying

If you've contributed to Dashy (or any other project), but your contributions are not showing up on your GH profile, or in Dashy's [Credits Page](https://github.com/Lissy93/dashy/blob/master/docs/credits.md), then this is likely a git config issue.

These statistics are generated using the username / email associated with commits. This info needs to be setup on your local machine using [`git config`](https://git-scm.com/docs/git-config).

Run the following commands (replacing name + email with your info):
- `git config --global user.name "John Doe"`
- `git config --global user.email johndoe@example.com`

For more info, see [Git First Time Setup Docs](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup).

Note that only contributions to the master / main branch or a project are counted
