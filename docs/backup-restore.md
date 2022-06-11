### Cloud Backup and Restore

Dashy has a built-in feature for securely backing up your config to a hosted cloud service, and then restoring it on another instance. This feature is totally optional, and if you do not enable it, then Dashy will not make any external network requests.

This is useful not only for backing up your configuration off-site, but it also enables Dashy to be used without having write a YAML config file, and makes it possible to use a public hosted instance, without the need to self-host.

<p align="center">
  <img src="https://i.ibb.co/p4pxSqX/dashy-backup-restore.png" width="600" />
</p>

### How it Works

All data is encrypted before being sent to the backend. In Dashy, this is done in [`CloudBackup.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/CloudBackup.js), using [crypto.js](https://github.com/brix/crypto-js)'s AES method, using the users chosen password as the key. The data is then sent to a [Cloudflare worker](https://developers.cloudflare.com/workers/learning/how-workers-works) (a platform for running serverless functions), and stored in a [KV](https://developers.cloudflare.com/workers/learning/how-kv-works) data store.


### Creating a Backup
Once you've got Dashy configured to your preference, open the Backup & Restore menu (click the Cloud icon in the top-right corner). Here you will be prompted to choose a password, which will be used to encrypt your data. If you forget this password, there will be no way to recover your config. After clicking 'Backup' your data will be encrypted, compressed and sent to the hosted cloud service. A backup ID will be returned (in the format of xxxx-xxxx-xxxx-xxxx), this is what you use, along with your password to restore the backup on another system, so take note of it. To update a backup, return to this menu, enter your password, and click 'Update Backup'.

### Restoring a Backup
To restore a backup, navigate to the Backup & Restore menu, and under restore, enter your backup ID, and the password you chose. Your config file will be downloaded, decrypted and applied to local storage. 

### Privacy & Security

Data is only ever sent to the cloud when the user actively triggers a backup. All transmitted data is first encrypted using [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). Your selected password never leaves your device, and is hashed before being compared. It is only possible to restore a configuration if you have both the backup ID and decryption password.

Because the data is encrypted on the client-side (before being sent to the cloud), it is not possible for a man-in-the-middle, government entity, website owner, or even Cloudflare to be able read any of your data. The biggest risk to your data, would be a weak password, or a compromised system.

Having said that, although the code uses robust security libraries and is open source- it was never intended to be a security product, and has not been audited, and therefore cannot be considered totally secure -  please keep that in mind.


### Fair Use Policy

Maximum of 24mb of storage per user. Please do not repeatedly hit the endpoint, as if the quota is exceeded the service may become less available to other users. Abuse may result in your IP being temporarily banned by Cloudflare.

---

### Self-Hosting the Backup Server


#### Quick Start
- Install Wrangler CLI Tool: `npm i -g @cloudflare/wrangler`
- Log into Cloudflare account: `wrangler login`
- Create a new project: ` wrangler generate my-project`
- Install dependencies: `cd my-project` && `npm i`


#### Populate `wrangler.toml`
- Add your `account_id` (found on the right sidebar of the Workers or Overview Dashboard)
- Add your `zone_id` (found in the Overview tab of your desired domain on Cloudflare)
- Add your `route`, which should be a domain or host, supporting a wildcard

```toml
name = "dashy-worker"
type = "javascript"

workers_dev = true
route = "example.com/*"
zone_id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
account_id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

kv_namespaces = [
  { binding = "DASHY_CLOUD_BACKUP", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
]
```

#### Complete `index.js`
- Write code to handle your requests, and interact with any other data sources in this file
- Generally, this is done within an event listener for 'fetch', and returns a promise
	- For Example:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response('Hello World!', {
    headers: { 'content-type': 'text/plain' },
  })
}
```

- For the code used for Dashy's cloud service, see [here](https://gist.github.com/Lissy93/d19b43d50f30e02fa25f349cf5cb5ed8#file-index-js)


#### Commands
- `wrangler dev` - To start the wrangler development server
- `wrangler publish` - To publish to your cloudflare account (first run `wrangler login`)

### API

There are four endpoints, and to keep things simple, they all use the same base URL/ route.

- **`GET`** - Get config for a given user
	- `backupId` - The ID of the desired encrypted object
	- `subHash`	- The latter half of the password hash, to verify ownership
- **`POST`** - Save a new config object, and returns `backupId`
	- `userData` - The encrypted, compressed and stringified user config
	- `subHash` - The latter half of the password hash, to verify ownership
- **`PUT`** - Update an existing config object
	- `backupId` - The ID of the object to update
	- `subHash`	- Part of the hash, to verify ownership of said object
	- `userData` - The new data to store
- **`DELETE`** - Delete a specified config object
	- `backupId` - The ID of the object to be deleted
	- `subHash`	- Part of the password hash, to verify ownership of the object

For more info, see the [API Docs](https://documenter.getpostman.com/view/2142819/TzXumzce).

If you are using Postman, you may find this pre-made [collection](https://www.getpostman.com/collections/58f79ddb150223f67b35) helpful in getting things setup.
