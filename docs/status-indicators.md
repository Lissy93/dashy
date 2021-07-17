# Status Indicators

Dashy has an optional feature that can display a small icon next to each of your running services, indicating it's current status. This is useful if you are using Dashy as your homelab's start page, as it gives you an overview of the health of each of your running services.

<p align="center">
  <img width="800" src="/docs/assets/status-check-demo.gif" />
</p>

## Enabling Status Indicators
By default, this feature is off. If you do not want this feature, just don't add the `statusCheck` to your conf.yml file, then no requests will be made.  

To enable status checks, you can either turn it on for all items, by setting `appConfig.statusCheck: true`, like:
```yaml
appConfig:
  statusCheck: true
```

Or you can enable/ disable it on a per-item basis, with the `item[n].statusCheck` attribute
```yaml
sections:
- name: Firewall
  items:
  - title: OPNsense
    description: Firewall Central Management
    icon: networking/opnsense.png
    url: https://192.168.1.1
		statusCheck: false
  - title: MalTrail
    description: Malicious traffic detection system
    icon: networking/maltrail.png
    url: http://192.168.1.1:8338
		statusCheck: true
  - title: Ntopng
    description: Network traffic probe and network use monitor
    icon: networking/ntop.png
    url: http://192.168.1.1:3001
		statusCheck: true
```

## Continuous Checking
By default, with status indicators enabled Dashy will check an applications status on page load, and will not keep indicators updated. This is usually desirable behavior. However, if you do want the status indicators to continue to poll your running services, this can be enabled by setting the `statusCheckInterval` attribute. Here you define an interval in seconds, and Dashy will poll your apps every x seconds. Note that if this number is very low (below 5 seconds), you may notice the app running slightly slower.

The following example, will instruct Dashy to continuously check the status of your services every 20 seconds

```
appConfig:
  statusCheck: true
  statusCheckInterval: 20
```

## Using a Different Endpoint
By default, the status checker will use the URL of each application being checked. In some situations, you may want to use a different endpoint for status checking. Similarly, some services provide a dedicated path for uptime monitoring. 

You can set the `statusCheckUrl` property on any given item in order to do this. The status checker will then ping that endpoint, instead of the apps main `url` property.

## Setting Custom Headers
If your service is responding with an error, despite being up and running, it is most likely because custom headers for authentication, authorization or encoding are required. You can define these headers under the `statusCheckHeaders` property for any service. It should be defined as an object format, with the name of header as the key, and header content as the value.
For example, `statusCheckHeaders: { 'X-Custom-Header': 'foobar' }`

## Troubleshooting Failing Status Checks
If the status is always returning an error, despite the service being online, then it is most likely an issue with access control, and should be fixed with the correct headers. Hover over the failing status to see the error code and response, in order to know where to start with addressing it.
If your service requires requests to include any authorization in the headers, then use the  `statusCheckHeaders` property, as described above.
If you are still having issues, it may be because your target application is blocking requests from Dashy's IP. This is a [CORS error](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), and can be fixed by setting the headers on your target app, to include:
```
Access-Control-Allow-Origin: https://location-of-dashy/
Vary: Origin
```
For further troubleshooting, use an application like [Postman](https://postman.com) to diagnose the issue.

## How it Works

When Dashy is loaded, items with `statusCheck` enabled will make a request, to `https://[your-host-name]/ping?url=[address-or-servce]`, which in turn will ping that running service, and respond with a status code. Response time is calculated from the difference between start and end time of the request. 

When the response completes, an indicator will display next to each item. The color denotes the status: Yellow while waiting for the response to return, green if request was successful, red if it failed, and grey if it was unable to make the request all together.

All requests are made straight from your server, there is no intermediary. So providing you are hosting Dashy yourself, and are checking the status of other self-hosted services, there shouldn't be any privacy concerns. Requests are made asynchronously, so this won't have any impact on page load speeds. However recurring requests (using `statusCheckInterval`) may run more slowly if the interval between requests is very short.
