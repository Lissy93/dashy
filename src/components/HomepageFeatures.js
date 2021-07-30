import React from 'react';
import './../styles/HomepageFeatures.scss';
import Button from '../components/Button';
import getColor from '../utils/ui-helpers';

import IconAuth from '../../static/icons/features_authentication.svg';
import IconCloudSync from '../../static/icons/features_cloud-sync.svg';
import IconDeploy from '../../static/icons/features_depoloyment.svg';
import IconIconography from '../../static/icons/features_icons.svg';
import IconLayout from '../../static/icons/features_layout-customization.svg';
import IconOpeningMethods from '../../static/icons/features_opening-methods.svg';
import IconShortcuts from '../../static/icons/features_shortcuts.svg';
import IconStatusIndicators from '../../static/icons/features_status-indicators.svg';
import IconThemes from '../../static/icons/features_themes.svg';
import IconUiConfig from '../../static/icons/features_ui-configuration.svg';

const FeatureList = [
  {
    title: 'Search & Shortcuts',
    description: (
      <>
        Arguably one of the most important features for any start page is the ability to find
        and launch applications as quickly as possible.
        <br />
        To filter services, in Dashy - just start typing. No need to select the search bar or use any special key.
        You can then use either the tab key or arrow keys to navigate the results,
        and hit enter to launch the currently selected application.
      </>
    ),
    icon: (<IconShortcuts />),
    demo: '../../static/img/homepage-assets/searching-demo.gif',
  },
  {
    title: 'Theming',
    description: (
      <>
        Dashy comes with a ton of built-in themes, so you'll easily find one that suits you.
        But it's also easy to write you're own. All colors, and most other CSS properties
        make use of variables, which make customizing the look and feel of Dashy simple.
        You can apply custom styles directly through the UI,
        or pass an external stylesheet into the config file
      </>
    ),
    icon: (<IconThemes />),
    demo: '../../static/img/homepage-assets/theme-slideshow.gif',
  },
  {
    title: 'Icons',
    description: (
      <>
        Both sections and items can have an icon associated with them, and defined under the icon attribute.
        There are many options for icons, including Font Awesome support, automatic fetching from favicon,
        programmatically generated icons and direct local or remote URLs.
        <ul>
          <li>
            <b>Favicon</b>: Set icon: favicon to fetch a services icon automatically from the URL of the corresponding application
          </li>
          <li>
            <b>Font-Awesome</b>: To use any font-awesome icon, specify the category,
            followed by the icon name, e.g. `fas fa-rocket` or `fab fa-monero`.
            You can also use Pro icons if you have a license key, just set it under `appConfig.fontAwesomeKey`.
          </li>
          <li>
            <b>Generative</b>: Setting `icon: generative`, will generate a unique for a given service, based on it's URL or IP.
          </li>
          <li>
            <b>URL</b>: You can also pass in a URL to an icon asset, hosted either locally or
            using any CDN service. E.g. icon: `https://i.ibb.co/710B3Yc/space-invader-x256.png`.
          </li>
          <li>
            <b>Local Image</b>: To use a local image, store it in `./public/item-icons/`
            (or create a volume in Docker: `-v /local/image/directory:/app/public/item-icons/`) ,
            and reference it by name and extension - e.g. set `icon: image.png` to use `./public/item-icon/image.png`.
            You can also use sub-folders here if you have a lot of icons, to keep them organized.
          </li>
        </ul>
      </>
    ),
    icon: (<IconIconography />),
  },
  {
    title: 'Customizable Layouts',
    description: (
      <>
        Structure your dashboard to fit your use case. Choose between multiple different layouts,
        item sizes and show/ hide components based on what you need. Less frequently used
        sections can be collapsed, and large sections can be set to span multiple
        columns or rows.
      </>
    ),
    icon: (<IconLayout />),
  },
  {
    title: 'Status Indicators',
    description: (
      <>
        Display the status of each service as a small dot, indicating which applications are down or running slowly.
        This is useful if you are using Dashy to organize your self-hosted services,
        as it gives a quick overview of the health of your lab. Hovering over the status will show
        additional data, including response time, host info and status message.
        <br />
        Status checks are off by default, but can be enabled globally with `appConfig.statusCheck: true`,
        or turned on or off on a per-item basis with `item[n].statusCheck`. You can also make use of
        continuous status checking, by specifying `statusCheckInterval` in seconds. If needed, you can
        call a different URL, by setting it in `statusCheckUrl`, and also pass in custom headers
        using `statusCheckHeaders`.
      </>
    ),
    icon: (<IconStatusIndicators />),
    demo: '../../static/img/homepage-assets/status-check-demo.gif',
  },
  {
    title: 'Launching Methods',
    description: (
      <>
        There are several different options for launching services from within Dashy.
        You can specify the default method with the `target` attribute, or right-click
        on any item to select an alternate method.
        <ul>
          <li>`sametab` - The app will be launched in the current tab</li>
          <li>`newtab` - The app will be launched in a new tab</li>
          <li>`modal` - Launch app in a resizable/ movable popup modal on the current page</li>
          <li>`workspace` - Changes to Workspace view, and launches app</li>
        </ul>
      </>
    ),
    icon: (<IconOpeningMethods />),
    demo: '../../static/img/homepage-assets/workspace-demo.gif',
  },
  {
    title: 'Authentication',
    description: (
      <>
        Dashy has a built-in login feature, which can be used for basic access control.
        To enable this feature, add an `auth` attribute under `appConfig`, containing an array of users.
        Each with a username, SHA-256 hashed password and optional user type.
      </>
    ),
    icon: (<IconAuth />),
  },
  {
    title: 'Cloud Backup & Sync',
    description: (
      <>
        Dashy has an optional built-in feature for securely backing up your config to
        a hosted cloud service, and then restoring it on another instance.
        This feature is totally optional, and is off by default.
        <br />
        All data is end-to-end encrypted with AES using your password as the key.
        It is processed with a CF worker, and stored in KV. You can delete your data
        at any time.
      </>
    ),
    icon: (<IconCloudSync />),
  },
  {
    title: 'Configuration through UI',
    description: (
      <>
        Dashy's config is stored in YAML format. It is possible to modify all settings
        directly through the config editor in the UI, which will then update your YAML file,
        and rebuild the app automatically.
      </>
    ),
    icon: (<IconUiConfig />),
    demo: '../../static/img/homepage-assets/config-editor-demo.gif',
  },
  {
    title: 'Easy Deployment',
    description: (
      <>
        Although Dashy can be easily run on bare metal, the quickest method of getting started is with Docker.
        Just run `docker run -p 8080:80 lissy93/dashy` to pull, build and and run Dashy.
      </>
    ),
    icon: (<IconDeploy />),
  },
];

function Feature({ title, description, icon, demo, index }) {
  const side = index % 2 == 0 ? 'left' : 'right';
  const color = getColor(index)
  return (
    <div className={`feature align-${side} color-${color}`}>
      <div className="feature-half text">
        <div className="feature-title">{icon}<h3>{title}</h3></div>
        {description}
        <div className="read-the-docs">
          <small>Learn more in the Docs</small>
          <Button to="/docs" color={color}>{icon} Docs</Button>
        </div>
      </div>
      <div className="feature-half assets">
        <img className="demo" src={demo} />
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className="home-page-features-wrapper">
      {FeatureList.map((props, index) => (
        <Feature key={index} index={index} {...props} />
      ))}
    </section>
  );
}
