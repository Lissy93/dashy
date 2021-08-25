# Alternate Views & Opening Methods

## Views
As well as the default start view, Dashy has several other start pages, for different tasks. You can switch views with the view-switcher button in the top-right, or set a default starting view using the `appConfig.startingView` attribute (can be `default`, `minimal` or `workspace`).

### Default
This is the main page that you will land on when you first launch the application. Here all of your sections and items will be visible, you can modify settings and search + launch your applications.

<p align="center">
  <b>Example of Default View</b><br />
  <img width="800" src="https://i.ibb.co/L8YbNNc/dashy-demo2.gif" alt="Demo" />
</p>

### Workspace
The workspace view displays your links in a sidebar on the left-hand side, and apps are launched within Dashy. This enables you to use all of your self-hosted apps from one place, and makes multi-tasking easy.

In the workspace view, you can keep previously opened websites/ apps open in the background, by setting `appConfig.enableMultiTasking: true`. This comes at the cost of performance, but does mean that your session with each app is preserved, enabling you to quickly switch between your apps.

<p align="center">
  <b>Example of Workspace View</b><br />
  <img alt="Workspace view demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/workspace-demo.gif" width="800" />
</p>

### Minimal View
The minimal view aims to be super fast and simple, and can be used as a browser startpage. Items are grouped into a tab view, and the last opened tab will be remembered. Similar to the main view, you can search and launch items just by typing, and right-clicking will show more options.

<p align="center">
  <b>Example of Minimal View</b><br />
  <img alt="Workspace view demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/minimal-view-demo.gif" width="800" />
</p>

## Opening Methods

Dashy supports several different ways to launch your apps. The default opening method for each app can be specified using the `target` attribute, with a value of one of the following:

- `sametab` - The app will be launched in the current tab
- `newtab` - The app will be launched in a new tab
- `modal` - Launch app in a resizable/ movable popup modal on the current page
- `workspace` - Changes to Workspace view, and launches app

Even if the target is not set (or is set to `sametab`), you can still launch any given app in an alternative method: Alt + Click will open the modal, and Ctrl + Click will open in a new tab. You can also right-click on any item to see all options (as seen in the screenshot below). This custom context menu can be disabled by setting `appConfig.disableContextMenu: true`.

<p align="center">
  <img width="500" src="https://i.ibb.co/vmZdSRt/dashy-context-menu-2.png" />
</p>

If you get a 'Refused to Connect' error in the modal or workspace views, then the target app has it's X-Frame-Options HTTP set to block requests from embedded content. You can easily fix this by setting this header to ALLOW, for instructions on how to do so, see the [Troubleshooting Docs](/docs/troubleshooting#refused-to-connect-in-modal-or-workspace-view).
