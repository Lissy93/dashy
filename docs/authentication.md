# Authentication

- [Built-In Login Feature](#authentication)
	- [Setting Up Authentication](#setting-up-authentication)
	- [Hash Password](#hash-password)
	- [Logging In and Out](#logging-in-and-out)
	- [Security](#security)
- [Alternative Authentication Methods](#alternative-authentication-methods)
	- [VPN](#vpn)
	- [IP-Based Access](#ip-based-access)
	- [Web Server Authentication](#web-server-authentication)
	- [OAuth Services](#oauth-services)
	- [Auth on Cloud Hosting Services](#static-site-hosting-providers)

Dashy has a basic login page included, and frontend authentication. You can enable this by adding users to the `auth` section under `appConfig` in your `conf.yml`. If this section is not specified, then no authentication will be required to access the app, and it the homepage will resolve to your dashboard.

## Setting Up Authentication
The `auth` property takes an array of users. Each user needs to include a username, hash and optional user type (`admin` or `normal`). The hash property is a [SHA-256 Hash](https://en.wikipedia.org/wiki/SHA-2) of your desired password. 

For example:
```yaml
appConfig:
  auth:
    - user: alicia
      hash: 4D1E58C90B3B94BCAD9848ECCACD6D2A8C9FBC5CA913304BBA5CDEAB36FEEFA3
      type: admin
    - user: edward
      hash: 5E884898DA28047151D0E56F8DC6292773603D0D6AABBDD62A11EF721D1542D8
      type: admin
```
## Hash Password
Dashy uses [SHA-256 Hash](https://en.wikipedia.org/wiki/Sha-256), a 64-character string, which you can generate using an online tool, such as [this one](https://passwordsgenerator.net/sha256-hash-generator/) or [CyberChef](https://gchq.github.io/CyberChef/) (which can be self-hosted/ ran locally).

A hash is a one-way cryptographic function, meaning that it is easy to generate a hash for a given password, but very hard to determine the original password for a given hash. This means, that so long as your password is long, strong and unique, it is safe to store it's hash in the clear. Having said that, you should never reuse passwords, hashes can be cracked by iterating over known password lists, generating a hash of each.

## Logging In and Out
Once authentication is enabled, so long as there is no valid token in cookie storage, the application will redirect the user to the login page. When the user enters credentials in the login page, they will be checked, and if valid, then a token will be generated, and they can be redirected to the home page. If credentials are invalid, then an error message will be shown, and they will remain on the login page. Once in the application, to log out the user can click the logout button (in the top-right), which will clear cookie storage, causing them to be redirected back to the login page.

## Security
Since all authentication is happening entirely on the client-side, it is vulnerable to manipulation by an adversary. An attacker could look at the source code, find the function used generate the auth token, then decode the minified JavaScript to find the hash, and manually generate a token using it, then just insert that value as a cookie using the console, and become a logged in user. Therefore, if you need secure authentication for your app, it is strongly recommended to implement this using your web server, or use a VPN to control access to Dashy. The purpose of the login page is merely to prevent immediate unauthorized access to your homepage.

Addressing this is on the todo list, and there are two potential solutions:
1. Encrypt all site data against the users password, so that an attacker can not physically access any data without the correct decryption key
2. Use a backend service to handle authentication, and do not return user data from the server until the correct credentials are provided. However, this would require either Dashy to be run using it's Node.js server, or the use of an external service

**[⬆️ Back to Top](#authentication)**

---

## Alternative Authentication Methods

If you are hosting Dashy locally, and require remote access, it is recommend to configure a VPN connection into your local network. For instances running on the cloud, you have several other options:
- IP-Based Access
- Web Server Authentication
- OAuth Services
- Password Protection (for cloud providers)

### VPN
The most secure method for accessing Dashy and other self-hosted services remotely is through a VPN connection, using something like [OpenVPN](https://openvpn.net/) or [WireGuard](https://www.wireguard.com/)

### IP-Based Access
If you have a static IP or use a VPN to access your running services, then you can use conditional access to block access to Dashy from everyone except users of your pre-defined IP address. This feature is offered by most cloud providers, and supported by most web servers.

##### Apache
In Apache, this is configured in your `.htaccess` file in Dashy's root folder, and should look something like:
```
Order Deny,Allow
Deny from all
Allow from [your-ip]
```

##### NGINX
In NGINX you can specify [control access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/) rules for a given site in your `nginx.conf` or hosts file. For example:
```
server {
	listen 80;
	server_name www.dashy.example.com;
	location / {
		root /path/to/dashy/;
		passenger_enabled on;
		allow [your-ip];
		deny all;
    }
  }
```

##### Caddy
In Caddy, [Request Matchers](https://caddyserver.com/docs/caddyfile/matchers) can be used to filter requests 
```
dashy.site {
	@public_networks not remote_ip [your-ip]
	respond @public_networks "Access denied" 403
}
```

### Web Server Authentication
Most web servers make password protecting certain apps very easy. Note that you should also set up HTTPS and have a valid certificate in order for this to be secure.

##### Apache
First crate a `.htaccess` file in Dashy's route directory. Specify the auth type and path to where you want to store the password file (usually the same folder). For example:
```
AuthType Basic  
AuthName "Please Sign into Dashy"  
AuthUserFile /path/dashy/.htpasswd  
require valid-user
```

Then create a `.htpasswd` file in the same directory. List users and their hashed passwords here, with one user on each line, and a colon between username and password (e.g. `[username]:[hashed-password]`). You will need to generate an MD5 hash of your desired password, this can be done with an [online tool](https://www.web2generators.com/apache-tools/htpasswd-generator).  Your file will look something like:
```
alicia:$apr1$jv0spemw$RzOX5/GgY69JMkgV6u16l0
```

##### NGINX
NGINX has an [authentication module](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html) which can be used to add passwords to given sites, and is fairly simple to set up. Similar to above, you will need to create a `.htpasswd` file. Then just enable auth and specify the path to that file, for example:
```
location / {
  auth_basic "closed site";
  auth_basic_user_file conf/htpasswd;
}
```
##### Caddy
Caddy has a [basic-auth](https://caddyserver.com/docs/caddyfile/directives/basicauth) directive, where you specify a username and hash. The password hash needs to be base-64 encoded, the [`caddy hash-password`](https://caddyserver.com/docs/command-line#caddy-hash-password) command can help with this. For example:
```
basicauth /secret/* {
	alicia JDJhJDEwJEVCNmdaNEg2Ti5iejRMYkF3MFZhZ3VtV3E1SzBWZEZ5Q3VWc0tzOEJwZE9TaFlZdEVkZDhX
}
```

##### Lighttpd
You can use the [mod_auth](https://doc.lighttpd.net/lighttpd2/mod_auth.html) module to secure your site with Lighttpd. Like with Apache, you need to first create a password file listing your usersnames and hashed passwords, but in Lighttpd, it's usually called `.lighttpdpassword`.

Then in your `lighttpd.conf` file (usually in the `/etc/lighttpd/` directory), load in the mod_auth module, and configure it's directives. For example:
```
server.modules += ( "mod_auth" )
auth.debug = 2
auth.backend = "plain"
auth.backend.plain.userfile = "/home/lighttpd/.lighttpdpassword"

$HTTP["host"] == "dashy.my-domain.net" {
  server.document-root = "/home/lighttpd/dashy.my-domain.net/http"
  server.errorlog = "/var/log/lighttpd/dashy.my-domain.net/error.log"
  accesslog.filename = "/var/log/lighttpd/dashy.my-domain.net/access.log"
  auth.require = (
    "/docs/" => (
      "method" => "basic",
      "realm" => "Password protected area",
      "require" => "user=alicia"
    )
  )
}
```
Restart your web server for changes to take effect.

### OAuth Services
There are also authentication services, such as [Ory.sh](https://www.ory.sh/), [Okta](https://developer.okta.com/), [Auth0](https://auth0.com/), [Firebase](https://firebase.google.com/docs/auth/). Implementing one of these solutions would involve some changes to the [`Auth.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/Auth.js) file, but should be fairly straight forward.

## Static Site Hosting Providers
If you are hosting Dashy on a cloud platform, you will probably find that it has built-in support for password protected access to web apps. For more info, see the relevant docs for your provider, for example: [Netlify Password Protection](https://docs.netlify.com/visitor-access/password-protection/), [Cloudflare Access](https://www.cloudflare.com/teams/access/), [AWS Cognito](https://aws.amazon.com/cognito/), [Azure Authentication](https://docs.microsoft.com/en-us/azure/app-service/scenario-secure-app-authentication-app-service) and [Vercel Password Protection](https://vercel.com/docs/platform/projects#password-protection).

**[⬆️ Back to Top](#authentication)**
