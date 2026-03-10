import React, { useState, useEffect } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import Button from './Button';
import IconHeart from '../../static/icons/about_heart.svg';
import IconDino from '../../static/icons/about_dino.svg';
import styles from '../styles/Authors.module.scss';

const CONTRIBUTORS_API = 'https://api.github.com/repos/lissy93/dashy/contributors';
const SPONSORS_API = 'https://github-sponsors-api.as93.net/lissy93';
const PER_PAGE = 100;

const FALLBACK_IMG = (
  <div className={styles.fallback}>
    <a
      href="https://github.com/Lissy93/dashy/graphs/contributors"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://readme-contribs.as93.net/contributors/lissy93/dashy?perRow=16&shape=squircle&textColor=999999&limit=96"
        alt="Dashy contributors"
        loading="lazy"
      />
    </a>
  </div>
);

function isBot(contributor) {
  return contributor.type !== 'User' || contributor.login.endsWith('[bot]');
}

async function fetchAllContributors() {
  const headers = { 'User-Agent': 'dashy-docs' };
  const allContributors = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${CONTRIBUTORS_API}?per_page=${PER_PAGE}&page=${page}`,
      { headers },
    );
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    allContributors.push(...data);
    if (data.length < PER_PAGE) break;
    page++;
  }

  return allContributors;
}

export default function Authors() {
  const pluginData = usePluginData('github-data');

  const [contributors, setContributors] = useState(pluginData?.contributors || null);
  const [error, setError] = useState(false);
  const [sponsors, setSponsors] = useState(pluginData?.sponsors || null);
  const [sponsorsError, setSponsorsError] = useState(false);

  useEffect(() => {
    fetchAllContributors()
      .then((data) => {
        if (data.length === 0) {
          // Only show error if we have no build-time data
          if (!contributors) setError(true);
        } else {
          setContributors(data.filter((c) => !isBot(c)));
        }
      })
      .catch(() => {
        if (!contributors) setError(true);
      });

    fetch(SPONSORS_API)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSponsors(data);
        } else if (!sponsors) {
          setSponsorsError(true);
        }
      })
      .catch(() => {
        if (!sponsors) setSponsorsError(true);
      });
  }, []);

  return (
    <section className={styles.authorsSection} aria-label="Contributors">
      <div className={styles.inner}>

        <h2 className={styles.heading}>Powered by You</h2>
        <div className={styles.enjoyingWrap}>
          <div className={styles.enjoyingWrapPart}>
            <h3 className={styles.subHeading}>Support us</h3>
            <p>
              If you've found Dashy useful, consider <a href="https://codeberg.org/alicia/dashy/src/branch/master/docs/contributing.md" target="_blank">contributing</a>,
              or dropping us a star!
            </p>
            <ul className={styles.linksList}>
              <li><a href="https://github.com/lissy93/dashy" target="_blank"><img src="https://cdn.as93.net/k1pcts?w=32" />GitHub</a> (source)</li>
              <li><a href="https://codeberg.org/alicia/dashy" target="_blank"><img src="https://cdn.as93.net/7c72qs?w=32" />Codeberg</a> (mirror)</li>
              <li><a href="https://hub.docker.com/r/lissy93/dashy" target="_blank"><img src="https://cdn.as93.net/t2hnw4?w=32" />DockerHub</a> (container)</li>
            </ul>
          </div>
          <div className={styles.enjoyingWrapPart}>
            <h3 className={styles.subHeading}>Author</h3>
              <div className={styles.authorInnerWrap}>
                <img src="https://avatars.githubusercontent.com/u/1862727" width="64" />
                <p>
                  Dashy was initially built by me, Alicia Sykes (<a href="https://github.com/lissy93" target="_blank">@Lissy93</a> on GitHub),
                  I build free and open source apps, focused on security, privacy, Linux and self-hosting.
                </p>
              </div>
            <div className={styles.ctaSection}>
              <Button to="https://github.com/sponsors/Lissy93" color="pink" size="small"><IconHeart /> Sponsor</Button>
              <Button to="https://apps.aliciasykes.com" color="blue" size="small"><IconDino /> More Apps</Button>
            </div>
          </div>
        </div>

      <h2 className={styles.heading}>Sponsors</h2>
      <p>Huge thanks to the following sponsors for supporting Dashy's development 💖</p>

      {sponsorsError && (
        <div className={styles.fallback}>
          <a href="https://github.com/sponsors/Lissy93" target="_blank" rel="noopener noreferrer">
            <img
              src="https://readme-contribs.as93.net/sponsors/lissy93?perRow=12&shape=squircle&textColor=999999&limit=96"
              alt="Dashy sponsors"
              loading="lazy"
            />
          </a>
        </div>
      )}

      {sponsors && (
        <div className={styles.grid} role="list">
          {sponsors.map((s, i) => (
            <a
              key={`${s.login}-${i}`}
              className={styles.tile}
              href={`https://github.com/${s.login}`}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
            >
              <img
                className={styles.avatar}
                src={`${s.avatarUrl}&s=80`}
                alt={`${s.login}'s avatar`}
                width="48"
                loading="lazy"
              />
              <span className={styles.name}>
                {s.name || s.login}
              </span>
            </a>
          ))}
        </div>
      )}

      <h2 className={styles.heading}>Contributors</h2>
      <p>Dashy was made possible, thanks to these wonderful contributors 🩵</p>

      {error && FALLBACK_IMG}

      {contributors && (
        <div className={styles.grid} role="list">
          {contributors.map((c, i) => (
            <a
              key={c.id}
              className={styles.tile}
              href={c.html_url}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              >
                {(i < 18 || c.contributions > 10) && (
                  <span className={styles.star} title="Top Contributor">⭐</span>
                )}
              <img
                className={styles.avatar}
                src={`${c.avatar_url}&s=80`}
                alt={`${c.login}'s avatar`}
                width="48"
                loading="lazy"
              />
              <span className={styles.name}>
                      {c.login} {c.contributions && c.contributions > 10 ? `(${c.contributions})` : ''}
              </span>
            </a>
          ))}
        </div>
      )}

      {!error && !contributors && <p>Loading contributors...</p>}

      </div>
    </section>
  );
}
