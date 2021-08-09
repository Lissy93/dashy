# Privacy & Security
Dashy was built with privacy in mind. Self-hosting your own apps and services is a great way to protect yourself from the mass data collection employed by big tech companies, and Dashy was designed to keep your local services organized and accessible from a single place.

It's fully open source, and I've tried to keep to code as clear and thoroughly documented as possible, which will make it easy for you to understand exactly how it works, and what goes on behind the scenes.

For privacy and security tips, check out another project of mine: **[Personal Security Checklist](https://github.com/Lissy93/personal-security-checklist)**.

---

## External Requests
By default, Dashy will not make any external requests, unless you configure it to. Some features (which are all off by default) do require internat access, and this section outlines those features, the services used, and links to their privacy policies.

### Font Awesome
If either sections or items are using font-awesome icons, then these will be fetched directly from font-awesome on page load. 

### Favicon Fetching
If an item's icon is set to `favicon`, then it will be auto-fetched from the corresponding URL. Since not all websites have their icon located at `/favicon.ico`, and if they do, it's often very low resolution (like `16 x 16 px`). Therefore, the default behavior is for Dashy to check if the URL is public, and if so will use an API to fetch the favicon. For self-hosted services, the favion will be fetched from the default path, and no external requests will be made.

The default favicon API is [Favicon Kit](https://faviconkit.com/), but this can be changed by setting `appConfig.faviconApi` to an alternate source (`google`, `clearbit`, `webmasterapi` and `allesedv` are supported). If you do not want to use any API, then you can set this property to `local`, and the favicon will be fetched from the default path. For hosted services, this will still incur an external request.

### Other Icons
Section icons, item icons and app icons are able to accept a URL to a raw image, if the image is hosted online then an external request will be made. To avoid the need to make external requests for icon assets, you can either use a self-hosted CDN, or store your images within `./public/item-icons` (which can be mounted as a volume if you're using Docker).

### Web Assets
By default, all assets required by Dashy come bundled within the source, and so no external requests are made. If you add an additional font, which is imported from a CDN, then that will incur an external request. The same applies for other web assets, like external images, scripts or styles.

### Status Checking
The status check util will ping your services directly, and does not rely on any third party. If you are checking the uptime status of a public/ hosted application, then please refer to that services privacy policy. For all self-hosted services, requests happen locally within your network, and are not external.

### Update Checks
When the application loads, it checks for updates. The results of which are displayed in the config menu of the UI. This was implemented because using a very outdated version of Dashy may have unfixed issues. Your version is fetched from the source (local request), but the latest version is fetched from GitHub, which is an external request. This can be disabled by setting `appConfig.disableUpdateChecks: true`

### Anonymous Error Reporting
Error reporting is disabled by default, and no data will ever be sent without your explicit consent. In fact, the error tracking method will not even be imported unless you have actively enabled it. [Sentry](https://github.com/getsentry/sentry) is used for this, it's an open source error tracking and performance monitoring tool, which is used to identify any issues which occur in the production app (if you enable it). 

The crash report includes the file or line of code that triggered the error, and a 2-layer deep stack trace. Reoccurring errors will also include the following user information: OS type (Mac, Windows, Linux, Android or iOS) and browser type (Firefox, Chrome, IE, Safari). Data scrubbing is enabled. IP address will not be stored. If any potentially identifiable data ever finds its way into a crash report, it will be automatically and permanently erased. All statistics collected are anonomized and stored securely, and ae automatically deleted after 14 days. For more about privacy and security, see the [Sentry Docs](https://sentry.io/security/).

Enabling anonymous error reporting helps me to discover bugs I was unaware of, and then fix them, in order to make Dashy more reliable long term. Error reporting is activated  by setting `appConfig.enableErrorReporting: true`.

If you need to monitor bugs yourself, then you can [self-host your own Sentry Server](https://develop.sentry.dev/self-hosted/), and use it by setting `appConfig.sentryDsn` to your Sentry instances [Data Source Name](https://docs.sentry.io/product/sentry-basics/dsn-explainer/), then just enable error reporting in Dashy.

---

## Dependencies
As with most web projects, Dashy relies on several [dependencies](https://github.com/Lissy93/dashy/blob/master/docs/credits.md#dependencies-). For links to each, and a breakdown of their licenses, please see [Legal](https://github.com/Lissy93/dashy/blob/master/.github/LEGAL.md).

Dependencies can introduce security vulnerabilities, but since all these packages are open source any issues are usually very quickly spotted. Dashy is using Snyk for dependency security monitoring, and you can see [the latest report here](https://snyk.io/test/github/lissy93/dashy).

---

## Securing your Environment
Running your self-hosted applications in individual, containerized environments (such as containers or VMs) helps keep them isolated, and prevent an exploit in one service effecting another.

There is very little complexity involved with Dashy, and therefore the attack surface is reasonably small, but it is still important to follow best practices and employ monitoring for all your self-hosted apps. A couple of things that you should look at include:
- Use SSL for securing traffic in transit
- Configure [authentication](/docs/authentication.md#alternative-authentication-methods) to prevent unauthorized access
- Keep your system, software and Dashy up-to-date
- Ensure your server is appropriately secured
- Manage users and SSH correctly
- Enable and configure firewall rules
- Implement security, malware and traffic scanning
- Setup malicious traffic detection
- Understand the [Docker attack fronts](https://docs.docker.com/engine/security/), and follow [Docker Security Best Practices](https://snyk.io/blog/10-docker-image-security-best-practices/)

This is covered in more detail in [App Management](/docs/management.md).

---

## Reporting a Security Issue
If you think you've found a critical issue with Dashy, please send an email to `security@mail.alicia.omg.lol`. You can encrypt it, using [`0688 F8D3 4587 D954 E9E5 1FB8 FEDB 68F5 5C02 83A7`](https://keybase.io/aliciasykes/pgp_keys.asc?fingerprint=0688f8d34587d954e9e51fb8fedb68f55c0283a7). You should receive a response within 48 hours.

All non-critical issues can be raised as a ticket.

Please include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue
