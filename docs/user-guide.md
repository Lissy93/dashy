## User Guide

This article outlines how to use the application. If you are instead looking for deployment instructions, see [Getting Started](/docs/getting-started.md) and [Configuring](/docs/configuring.md)

### Contents
- [Searching](#searching)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Theme Switching](#theme-switching)
- [Visual Options](#visual-options)
- [Opening Items](#opening-items)
- [Sections and Items](#sections-and-items)
- [Icons](#icons)
- [Metadata](#metadata)
- [Editing Config](#editing-config)
- [Managing Config Data](#managing-config-data)

### Searching

A key requirement for any start page is being able to quickly and effectively find the item your looking for. For Dashy, a lot of thought was put into the most intuitive method to filter links.

To start searching, simply start typing. Your search term will show up in the filter field in the upper-left section, and results will be filtered accordingly.

The following properties are used to filter items by:
- Title / Item name
- Provider - The optional field, indicating the provider of a given app or service
- URL - Only the base URL is searched, the protocol and parameters are omitted
- Description

**[⬆️ Back to Top](#user-guide)**

### Keyboard Shortcuts

Many people find using the keyboard significantly more efficient than having to reach for the mouse. And so Dashy has a series of keybindings and shortcuts to enable you to navigate through items quickly.

Once you've searched for a given item, you can then tab through the list (or Shift + Tab to go backwards) until you've found the item you're looking for. You can also use the arrow keys to navigate up, down, left and right through the grid. To launch an item, just hit enter. You can also open an item in a new tab with Ctrl + Enter, or open the item in a pop-up modal with Alt + Enter. To close an open popup item, or any open menus, just hit Esc.

**[⬆️ Back to Top](#user-guide)**

### Theme Switching

You can change the current theme using the dropdown menu in the upper-right-hand quadrant. Your selected theme will be stored in local storage, and applied next time you load the page. For more information on customizing the look and feel of Dashy, see [Themeing Docs](/docs/theming.md)

**[⬆️ Back to Top](#user-guide)**

### Visual Options

There are several pre-built layout options to choose from depending on your requirements. Like the theme these options will be remembered in browser storage and applied on load.

The first is Layout. This determines how sections are organised on the screen. This can be set to either grid (auto), horizontal or vertical. Vertical layout will cause each section to take up the full width of the screen, and minimum height. Horizontal is the opposite, where every section is on the same row, and spans the full height of the screen.

Next there's icon size. This changes the size of the item and it's icon. It can be useful to use a smaller size when there are a lot of items, or a larger size if you commonly access Dashy from a touch screen tablet.

![layout-options](https://i.ibb.co/NnzF82t/available-layout-options.png)

**[⬆️ Back to Top](#user-guide)**

### Opening Items

There are three methods of opening items. Clicking (or hitting Enter on a selected item) will use the default method, specified in the config file, under `item.target`. You can use Ctrl + Click or Ctrl + Enter to open and item in a new tab. 

You can also use Alt + Click or Alt + Enter, to open an item in a popup window. You can use drag the tab in the bottom-right corner of the pop-up to resize it. To close an item opened in a pop-up, click the close button, use the Esc key, or click anywhere outside the popup.

![Example of a pop-up opened item](https://i.ibb.co/zSnznFF/dashy-popup.png)

**[⬆️ Back to Top](#user-guide)**

### Sections and Items

The main content in Dashy is split into sections, which contain icons. You can have as many sections as you need, and each section can have an unlimited amount of icons. Visually, the grid layout works better when sections have a similar number of icons.

Sections are collapsible, which is useful for those sections which contain less used applications, or are particularly long. The collapse state of a given section is remembered (stored in local storage), and applied on load.

Sections also have several optional properties, which are specified under `section.displayData`, and let you set certain display settings. A full list of options can be found in the [configuring docs](/docs/configuring.md).


```
 ┌─────────────────────────────────────────────────────┐
 │ Title                                               │
 │ Sub-Title/ Description              Link 1   Link 2 │
 ├──────────────┬─────────────────┬────────────────────┤
 │ Search       │                 │  Display Options   │
 ├──────────────┘                 └────────────────────┤
 │                                                     │
 │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
 │  │ Section 1    │ │ Section 2    │ │ Section 3    │ │
 │  ├──────────────┤ ├──────────────┤ ├──────────────┤ │
 │  │ ┌───┐ ┌───┐  │ │ ┌───┐ ┌───┐  │ │ ┌───┐ ┌───┐  │ │
 │  │ │   │ │   │  │ │ │   │ │   │  │ │ │   │ │   │  │ │
 │  │ └───┘ └───┘  │ │ └───┘ └───┘  │ │ └───┘ └───┘  │ │
 │  │ ┌───┐ ┌───┐  │ │ ┌───┐ ┌───┐  │ │ ┌───┐ ┌───┐  │ │
 │  │ │   │ │   │  │ │ │   │ │   │  │ │ │   │ │   │  │ │
 │  │ └───┘ └───┘  │ │ └───┘ └───┘  │ │ └───┘ └───┘  │ │
 │  └──────────────┘ └──────────────┘ └──────────────┘ │
 │                                                     │
 ├─────────────────────────────────────────────────────┤
 └─────────────────────────────────────────────────────┘
```

**[⬆️ Back to Top](#user-guide)**

### Icons

Both sections and items can have an icon associated with them. There are several options for specifying icons. You can let the icon be automatically resolved and fetched from the items associated URL, by just setting the icon to `favicon`. You can use a font-awesome icon, by specifying it's name and category. Or you can pass in a URL, either to a locally hosted or remote image. For local images, you can put them in `./public/item-icons/` and then reference them just by the file name.

**[⬆️ Back to Top](#user-guide)**

### Metadata

Basic site information, displayed in the header and footer can be set from the UI. This includes: title, sub-title, footer text, and nav-bar links. Click the wrench icon in the upper-right corner, then go to the Site Metadata tab. Fill in your new data, and hit save. The page will be refreshed, and your changes will appear. These settings are stored under `pageInfo` in the config, and if set through the UI, will only be applied locally.

**[⬆️ Back to Top](#user-guide)**

### Editing Config

The config file can be edited from the UI, but take note that changes are only applied locally. You will need to either export this data into your conf.yml, or use the cloud backup and sync feature.

To make changes to the config file, click the wrench icon in the upper-left hand corner. Then go to the Config tab. Here you'll find a JSON editor. You can switch from tree mode to plain-text mode if you find that easier. And parsing or validation issues will be displayed at the bottom of the screen. 

**[⬆️ Back to Top](#user-guide)**

### Managing Config Data

You can download, backup or reset local config data directly from the UI. To apply config to Dashy on other devices, you will need to either download the config file, or use the cloud backup and sync feature. To download config, click the Wrench icon, in the upper-right hand corner, and then go to Download. Similarly, for cloud backup, click the Cloud icon in the upper right corner, and fill in the required fields. For detailed instructions, and technical information about backup and sync, please see the [Cloud Backup Documentation](/docs/backup-restore.md). You can also Reset all local settings from the config menu. This will not effect any data saved in your systems `conf.yml` file.

**[⬆️ Back to Top](#user-guide)**
