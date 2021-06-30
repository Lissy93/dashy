import React from 'react';
import './../styles/HomepageFeatures.scss';
import Button from '../components/Button';

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
        To filter services, just start typing. No need to select the search bar or use any special key.
        You can then use either the tab key or arrow keys to select and move between results,
        and hit enter to launch the currently selected application.
      </>
    ),
    icon: (<IconShortcuts />),
  },
  {
    title: 'Theming',
    description: (
      <>
        Dashy comes with a ton of built-in themes, so you'll easily find one that suits you.
        But it's also easy to write you're own. All colors, and most other CSS properties
        make use of CSS variables, which makes customizing the look and feel of Dashy very easy.
        You can apply custom styles directly through the UI,
        or pass an external stylesheet into the config file
      </>
    ),
    icon: (<IconThemes />),
  },
  {
    title: 'Customizable Layouts',
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
    icon: (<IconLayout />),
  },
];

const getColor = (index) => {
  const remainder = index % 4;
  switch (remainder) {
    case 0: return 'pink';
    case 1: return 'blue';
    case 2: return 'green';
    case 3: return 'yellow';
    default: return 'white';
  }
};

function Feature({ title, description, icon, index }) {
  const side = index % 2 == 0 ? 'left' : 'right';
  const color = getColor(index)
  return (
    <div className={`feature align-${side} color-${color}`}>
      <div className="feature-half text">
        <div className="feature-title">{icon}<h3>{title}</h3></div>
        <p>{description}</p>
        <Button to="/docs" color={color}>{icon} Docs</Button>
      </div>
      <div className="feature-half assets">
        <div class="screenshot"></div>
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
