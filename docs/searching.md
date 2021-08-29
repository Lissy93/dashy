# Keyboard Shortcuts

## Searching
One of the primary purposes of Dashy is to allow you to quickly find and launch a given app. To make this as quick as possible, there is no need to touch the mouse, or press a certain key to begin searching - just start typing. Results will be filtered in real-time. No need to worry about case, special characters or small typos, these are taken care of, and your results should appear.

## Navigating
You can navigate through your items or search results using the keyboard. You can use <kbd>Tab</kbd> to cycle through results, and <kbd>Shift</kbd> + <kbd>Tab</kbd> to go backwards. Or use the arrow keys, <kbd>↑</kbd>, <kbd>→</kbd>, <kbd>↓</kbd> and <kbd>←</kbd>.

## Launching Apps
You can launch a elected app by hitting <kbd>Enter</kbd>. This will open the app using your default opening method, specified in `target` (either `newtab`, `sametab`, `modal` or `workspace`). You can also use <kbd>Alt</kbd> + <kbd>Enter</kbd> to open the app in a pop-up modal, or <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to open it in a new tab. For all available opening methods, just right-click on an item, to bring up the context menu.

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

#### Setting Search Engine
Set your default search engine using the `webSearch.searchEngine` property. This defaults to DuckDuckGo. Search engine must be referenced by their key, the following providers are supported:
- `duckduckgo`, `google`, `whoogle`, `qwant`, `startpage`, `searx-bar`, `searx-info`
- `searx-tiekoetter`, `searx-bissisoft`, `ecosia`, `metager`, `swisscows`, `mojeek`, `peekier`
- `wikipedia`, `wolframalpha`, `stackoverflow`, `github`, `reddit`, `youtube`, `bbc`

#### Using Custom Search Engine
You can also use a custom search engine, that isn't included in the above list (like a self-hosted instance of [Whoogle](https://github.com/benbusby/whoogle-search) or [Searx](https://searx.github.io/searx/)). Set `searchEngine: custom`, and then specify the URL (plus query params) to you're search engine under `customSearchEngine`.

For example: 
```yaml
appConfig:
  webSearch:
    searchEngine: custom
    customSearchEngine: 'https://searx.local/search?q='
```

#### Setting Opening Method
In a similar way to opening apps, you can specify where you would like search results to be opened. This is done under the `openingMethod` attribute, and can be set to either  `newtab`, `sametab` or `workspace`. By default results are opened in a new tab.

#### Disabling Web Search
Web search can be disabled, by setting `disableWebSearch`, for example:

```yaml
appConfig:
  webSearch: { disableWebSearch: true }
```

## Clearing Search
You can clear your search term at any time, resting the UI to it's initial state, by pressing <kbd>Esc</kbd>. This can also be used to close any open pop-up modals.
