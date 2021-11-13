# Keyboard Shortcuts

## Searching
One of the primary purposes of Dashy is to allow you to quickly find and launch a given app. To make this as quick as possible, there is no need to touch the mouse, or press a certain key to begin searching - just start typing. Results will be filtered in real-time. No need to worry about case, special characters or small typos, these are taken care of, and your results should appear.

## Navigating
You can navigate through your items or search results using the keyboard. You can use <kbd>Tab</kbd> to cycle through results, and <kbd>Shift</kbd> + <kbd>Tab</kbd> to go backwards. Or use the arrow keys, <kbd>↑</kbd>, <kbd>→</kbd>, <kbd>↓</kbd> and <kbd>←</kbd>.

## Launching Apps
You can launch a elected app by hitting <kbd>Enter</kbd>. This will open the app using your default opening method, specified in `target` (either `newtab`, `sametab`, `modal`, `top` or `workspace`). You can also use <kbd>Alt</kbd> + <kbd>Enter</kbd> to open the app in a pop-up modal, or <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to open it in a new tab. For all available opening methods, just right-click on an item, to bring up the context menu.

## Tags
By default, items are filtered by the `title` attribute, as well as the hostname (extracted from `url`), the `provider` and `description`. If you need to find results based on text which isn't included in these attributes, then you can add `tags` to a given item. 

```yaml
  items:
  - title: Plex
    description: Media library
    icon: favicon
    url: https://plex.lab.local
    tags: [ movies, videos, music ]
  - title: FreshRSS
    description: RSS Reader
    icon: favicon
    url: https://freshrss.lab.local
    tags: [ news, updates, blogs ]

```

In the above example, Plex will be visible when searching for 'movies', and FreshRSS with 'news'


## Custom Hotkeys
For apps that you use regularly, you can set a custom keybinding. Use the `hotkey` parameter on a certain item to specify a numeric key, between `0 - 9`. You can then launch that app, by just pressing that key, which is much quicker than searching for it, if it's an app you use frequently.

```yaml
- title: Bookstack
  icon: far fa-books
  url: https://bookstack.lab.local/
  hotkey: 2
- title: Git Tea
  icon: fab fa-git
  url: https://git.lab.local/
  target: workspace
  hotkey: 3
```

In the above example, pressing <kbd>2</kbd> will launch Bookstack. Or hitting <kbd>3</kbd> will open Git in the workspace view.

## Web Search
It's possible to search the web directly from Dashy, which might be useful if you're using Dashy as your start page. This can be done by typing your query as normal, and then pressing <kbd>⏎</kbd>. Web search options are configured under `appConfig.webSearch`.

### Setting Search Engine
Set your default search engine using the `webSearch.searchEngine` property. This defaults to DuckDuckGo. Search engine must be referenced by their key, the following providers are supported:
- [`duckduckgo`](https://duckduckgo.com), [`google`](https://google.com), [`whoogle`](https://whoogle.sdf.org), [`qwant`](https://www.qwant.com), [`startpage`](https://www.startpage.com), [`searx-bar`](https://searx.bar), [`searx-info`](https://searx.info)
- [`searx-tiekoetter`](https://searx.tiekoetter.com), [`searx-bissisoft`](https://searx.bissisoft.com), [`ecosia`](https://www.ecosia.org), [`metager`](https://metager.org/meta), [`swisscows`](https://swisscows.com), [`mojeek`](https://www.mojeek.com)
- [`wikipedia`](https://en.wikipedia.org), [`wolframalpha`](https://www.wolframalpha.com), [`stackoverflow`](https://stackoverflow.com), [`github`](https://github.com), [`reddit`](https://www.reddit.com), [`youtube`](https://youtube.com), [`bbc`](https://www.bbc.co.uk)

### Using Custom Search Engine
You can also use a custom search engine, that isn't included in the above list (like a self-hosted instance of [Whoogle](https://github.com/benbusby/whoogle-search) or [Searx](https://searx.github.io/searx/)). Set `searchEngine: custom`, and then specify the URL (plus query params) to you're search engine under `customSearchEngine`.

For example: 
```yaml
appConfig:
  webSearch:
    searchEngine: custom
    customSearchEngine: 'https://searx.local/search?q='
```

### Setting Opening Method
In a similar way to opening apps, you can specify where you would like search results to be opened. This is done under the `openingMethod` attribute, and can be set to either  `newtab`, `sametab` or `workspace`. By default results are opened in a new tab.

### Using Bangs
An insanely useful feature of DDG is [Bangs](https://duckduckgo.com/bang), where you type a specific character combination at the start of your search query, and it will be redirected the that website, such as '!w Docker' will display the Docker wikipedia page. Dashy has a similar feature, enabling you to define your own custom bangs to redirect search results to a specific app, website or search engine.

This is done under the `searchBangs` property, with a list of key value pairs. The key is what you will type, and the value is the destination, either as an identifier or a URL with query parameters.  

For example:

```yaml
appConfig:
  webSearch:
    searchEngine: 'duckduckgo'
    openingMethod: 'newtab'
    searchBangs:
      /r: reddit
      /w: wikipedia
      /s: https://whoogle.local/search?q=
      /a: https://www.amazon.co.uk/s?k=
      ':wolf': wolframalpha
      ':so': stackoverflow
      ':git': github
```

Note that bangs begging with `!` or `:` must be surrounded them in quotes

### Disabling Web Search
Web search can be disabled, by setting `disableWebSearch`, for example:

```yaml
appConfig:
  webSearch: { disableWebSearch: true }
```

## Clearing Search
You can clear your search term at any time, resting the UI to it's initial state, by pressing <kbd>Esc</kbd>.
This can also be used to close any open pop-up modals.
