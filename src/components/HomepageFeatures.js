import React from 'react';
import './../styles/HomepageFeatures.scss';

const FeatureList = [
  {
    title: 'Search & Shortcuts',
    description: (
      <>
        Quisque ut dolor gravida, placerat libero vel, euismod. Ambitioni dedisse
        scripsisse iudicaretur.Donec sed odio operae, eu vulputate felis rhoncus.
        Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae.
      </>
    ),
  },
  {
    title: 'Theming',
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Customizable Layouts',
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

function Feature({ title, description, index }) {
  const side = index % 2 == 0 ? 'left' : 'right';
  return (
    <div className={`feature align-${side}`}>
      <div className="feature-half">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="feature-half">
        <p>Static Asset will go here</p>
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
