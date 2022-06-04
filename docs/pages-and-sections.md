# Pages and Sections

## Multi-Page Support

You can have additional pages within your dashboard, with each having it's own config file. The config files for sub-pages can either be stored locally, or hosted separately. A link to each additional page will be displayed in the navigation bar.

You can edit additional pages using the interactive editor, exactly the same was as your primary page (so long as it's local). But please save changes to one page, before you start editing the next. 

### Using Local Sub-Pages

To get started, create a new `.yml` config file for your sub-page, placing it within `/app/public`. Then within your primary `conf.yml`, choose a name, and specify the path to the new file.

For example:

```yaml
pages:
- name: Networking Services
  path: 'networking.yml'
- name: Work Stuff
  path: 'work.yml'
```

If you're sub-page is located within `/app/public`, then you only need to specify the filename, but if it's anywhere else, then the full path is required.

### Using Remote Sub-Pages

Config files don't need to be local, you can store them anywhere, and data will be imported as sub-pages on page load.

For example:

```yaml
pages:
- name: Getting Started
  path: 'https://snippet.host/tvcw/raw'
- name: Homelab
  path: 'https://snippet.host/tetp/raw'
- name: Browser Startpage
  path: 'https://snippet.host/zcom/raw'
```

There are many options of how this can be used. You could store your config within a Git repository, in order to easily track and rollback changes. Or host your config on your NAS, to have it backed up with the rest of your files. Or use a hosted paste service, for example [snippet.host](https://snippet.host/), which supports never-expiring CORS-enabled pastes, which can also be edited later.

You will obviously not be able to write updates to remote configs directly through the UI editor, but you can still make and preview changes, then use the export menu to get a copy of the new config, which can then be pasted to the remote source manually.
The config file must, of course be accessible from within Dashy. If your config contains sensitive info (like API keys, credentials, secret URLs, etc), take care not to expose it to the internet.

The following example shows creating a config, publishing it as a [Gist](https://gist.github.com/), copying the URL to the raw file, and using it within your dashboard.

<p align="center">
  <img width="700" alt="Public config in a gist demo"
    src="https://i.ibb.co/55jm3LG/how-to-use-remote-config-sub-page.gif"
  />
</p>

### Restrictions

Only top-level fields supported by sub-pages are `pageInfo` and `sections`. The `appConfig` and `pages` will always be inherited from your main `conf.yml` file. Other than that, sub-pages behave exactly the same as your default view, and can contain sections, items, widgets and page info like nav links, title and logo.

Note that since page paths are required by the router, they are set at build-time, not run-time, and so a rebuild (happens automatically) is required for changes to page paths to take effect (this only applies to changes to the `pages` array, rebuild isn't required for editing page content).


## Sub-Items

A normal section will contain zero or more items, for example:

```yaml
- name: Coding
  icon: far fa-code
  items:
  - title: GitHub
    url: https://github.com/
  - title: StackOverflow
    url: http://stackoverflow.com/
```

But items can also be grouped together, referred to as sub-items. This is useful for a group of less frequently used items, which you don't want to take up too much space, or for action buttons (_coming soon_).

Item groups may also have an optional title.

```yaml
- name: Coding
  icon: far fa-code
  items:
  - title: Normal Item 1
  - title: Normal Item 2
  - subItems:
    - title: JavaScript
      url: https://developer.mozilla.org
      icon: si-javascript
    - title: TypeScript
      url: https://www.typescriptlang.org/docs
      icon: si-typescript
    - title: Svelt
      url: https://svelte.dev/docs
      icon: si-svelte
    - title: Go
      url: https://go.dev/doc
      icon: si-go
```
