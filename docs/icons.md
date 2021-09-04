## Icons

Both sections and items can have an icon, which is specified using the `icon` attribute. Using icons improves the aesthetics of your UI and makes the app more intuitive to use. There are several options when it comes to setting icons, and this article outlines each of them

- [Font Awesome Icons](#font-awesome)
- [Auto-Fetched Favicons](#favicons)
- [Generative Icons](#generative-icons)
- [Emoji Icons](#emoji-icons)
- [Icons by URL](#icons-by-url)
- [Local Icons](#local-icons)
- [No Icon](#no-icon)

<p align="center">
  <img width="500" src="https://i.ibb.co/GTVmZnc/dashy-example-icons.png" />
</p>

Note that, if you are using icons from an external source (like font-awesome or material-design-icons), then the relevant font file will be loaded in automatically if and when needed, but combining icons from multiple services may have a negative impact on performance.

### Font Awesome
You can use any [Font Awesome Icon](https://fontawesome.com/icons) simply by specifying it's identifier. This is in the format of `[category] [name]` and can be found on the page for any given icon on the Font Awesome site. For example: `fas fa-rocket`, `fab fa-monero` or `fas fa-unicorn`.

Font-Awesome has a wide variety of free icons, but you can also use their pro icons if you have a membership. To do so, you need to specify your license key under: `appConfig.fontAwesomeKey`. This is usually a 10-digit string, for example `13014ae648`.

<p align="center">
  <img width="580" src="https://i.ibb.co/pdrw8J4/fontawesome-icons2.png" />
</p>

### Favicons
Dashy can auto-fetch the favicon for a given service using it's URL. Just set `icon: favicon` to use this feature. If the services URL is a local IP, then Dashy will attempt to find the favicon from `http://[ip]/favicon.ico`. This has two issues, favicons are not always hosted at the same location for every service, and often the default favicon is a low resolution. Therefore to fix this, for remote services an API is used to return a high-quality icon for any online service.

<p align="center">
  <img width="580" src="https://i.ibb.co/k6wyhnB/favicon-icons.png" />
</p>

The default favicon API is [Favicon Kit](https://faviconkit.com/), a free and reliable service for returning images from any given URL. However several other API's are supported. To change the API used, under `appConfig`, set `faviconApi` to one of the following values:

- `faviconkit` - [faviconkit.com](https://faviconkit.com/) (Recommend)
- `google` - Official Google favicon API service, good support for all sites, but poor quality
- `clearbit` - [Clearbit](https://clearbit.com/logo) returns high-quality logos from mainstream websites
- `webmasterapi` - [WebMasterAPI](https://www.webmasterapi.com/get-favicons)
- `allesedv` - [allesedv.com](https://favicon.allesedv.com/) is a highly efficient IPv6-enabled service

You can also force Dashy to always get favicons from the root of the domain, and not use an external service, by setting `appConfig.faviconApi` to `local`.

To use a different favicon API for certain items, then set `icon: favicon-[api]`, e.g. `favicon-clearbit`

If for a given service none of the APIs work in your situation, and nor does local, then the best option is to find the path of the services logo or favicon, and set the icon to the URL of the raw image.

### Generative Icons
Uses a unique and programmatically generated icon for a given service. This is particularly useful when you have a lot of similar services with a different IP or port, and no specific icon. These icons are generated with [ipsicon.io](https://ipsicon.io/). To use this option, just set an item's to: `icon: generative`.

<p align="center">
  <img width="400" src="https://i.ibb.co/qrNNNcm/generative-icons.png" />
</p>

### Emoji Icons
You can use almost any emoji as an icon for items or sections. You can specify the emoji either by pasting it directly, using it's unicode ( e.g. `'U+1F680'`) or shortcode (e.g. `':rocket:'`). You can find these codes for any emoji using [Emojipedia](https://emojipedia.org/) (near the bottom of emoji each page), or for a quick reference to emoji shortcodes, check out [emojis.ninja](https://emojis.ninja/) by @nomanoff.

<p align="center">
  <img width="580" src="https://i.ibb.co/YLwgTf9/emoji-icons-1.png" />
</p>

The following examples will all render the same rocket (🚀) emoji:

```yaml
items:
- title: Shortcode
  icon: ':rocket:'
- title: Unicode
  icon: 'U+1F680'
- title: Emoji
  icon: 🚀
```

### Icons by URL
You can also set an icon by passing in a valid URL pointing to the icons location. For example `icon: https://i.ibb.co/710B3Yc/space-invader-x256.png`, this can be in .png, .jpg or .svg format, and hosted anywhere- so long as it's accessible from where you are hosting Dashy. The icon will be automatically scaled to fit, however loading in a lot of large icons may have a negative impact on performance, especially if you visit Dashy from new devices often.

### Local Icons
You may also want to store your icons locally, bundled within Dashy so that there is no reliance on outside services. This can be done by putting the icons within Dashy's `./public/item-icons/` directory. If you are using Docker, then the easiest option is to map a volume from your host system, for example: `-v /local/image/directory:/app/public/item-icons/`. To reference an icon stored locally, just specify it's name and extension. For example, if my icon was stored in `/app/public/item-icons/maltrail.png`, then I would just set `icon: maltrail.png`.

You can also use sub-folders within the `item-icons` directory to keep things organised. You would then specify an icon with it's folder name slash image name. For example: `networking/monit.png`

### Material Design Icons
Dashy also supports 5000+ [material-design-icons](https://github.com/Templarian/MaterialDesign). To use these, first find the name/ slug for your icon [here](https://dev.materialdesignicons.com/icons), and then prefix is with `mdi-`.

For example:
```yaml
sections:
- name: Material Design Icons Example
  items:
  - title: Alien Icon
    icon: mdi-alien 
  - title: Fire Icon
    icon: mdi-fire 
  - title: Dino Icon
    icon: mdi-google-downasaur 

```

### Simple Icons
To use glyphs from [SimpleIcons.org](https://simpleicons.org/), first find the icon slug, and then prefix it with `si-`. The image will be loaded directly from the Simple Icons 

### No Icon
If you don't wish for a given item or section to have an icon, just leave out the `icon` attribute.
