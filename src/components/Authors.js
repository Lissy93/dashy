import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Button from './Button';
import IconHeart from '../../static/icons/about_heart.svg';
import IconDino from '../../static/icons/about_dino.svg';
import styles from '../styles/Authors.module.scss';

const CONTRIBUTORS_API = 'https://api.github.com/repos/lissy93/dashy/contributors';
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

async function fetchAllContributors(token) {
  const headers = { 'User-Agent': 'dashy-docs' };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

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
  const { siteConfig } = useDocusaurusContext();
  const githubToken = siteConfig.customFields?.githubToken || '';

  const [contributors, setContributors] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAllContributors(githubToken)
      .then((data) => {
        if (data.length === 0) {
          setError(true);
        } else {
          setContributors(data.filter((c) => !isBot(c)));
        }
      })
      .catch(() => setError(true));
  }, [githubToken]);

  return (
    <section className={styles.authorsSection} aria-label="Contributors">
      <div className={styles.inner}>

        <h2 className={styles.heading}>Enjoying Dashy?</h2>
        <div className={styles.enjoyingWrap}>
          <div className={styles.enjoyingWrapPart}>
            <h3 className={styles.subHeading}>Support us</h3>
            <p>
              If you've found Dashy useful, consider <a href="https://codeberg.org/alicia/dashy/src/branch/master/docs/contributing.md" target="_blank">contributing</a>,
              or dropping us a star!
            </p>
            <ul>
              <li><a href="https://github.com/lissy93/dashy" target="_blank">GitHub</a> (source)</li>
              <li><a href="https://codeberg.org/alicia/dashy" target="_blank">Codeberg</a> (mirror)</li>
              <li><a href="https://hub.docker.com/r/lissy93/dashy" target="_blank">DockerHub</a> (container)</li>
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
