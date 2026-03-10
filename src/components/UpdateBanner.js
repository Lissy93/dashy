import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from '../styles/UpdateBanner.module.scss';

const REPO = 'lissy93/dashy';
const STORAGE_KEY = 'dashy-update-dismissed';
const MAX_AGE_DAYS = 14;

export default function UpdateBanner() {
  const { siteConfig } = useDocusaurusContext();
  const githubToken = siteConfig.customFields?.githubToken || '';
  const pluginData = usePluginData('github-data');

  const buildTag = pluginData?.latestTag || null;

  // Derive initial version from build data (no localStorage — unavailable during SSR)
  const initialVersion = useMemo(() => {
    if (!buildTag?.name || !buildTag?.date) return null;
    const tagDate = new Date(buildTag.date);
    const ageDays = (Date.now() - tagDate.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > MAX_AGE_DAYS) return null;
    return buildTag.name;
  }, [buildTag]);

  const [version, setVersion] = useState(initialVersion);
  const [dismissing, setDismissing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const headers = useMemo(() => {
    const h = { 'User-Agent': 'dashy-docs' };
    if (githubToken) h['Authorization'] = `token ${githubToken}`;
    return h;
  }, [githubToken]);

  const fetchJson = useCallback(async (url) => {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  }, [headers]);

  useEffect(() => {
    // Client-only: clear build-time version if user already dismissed it
    if (initialVersion && localStorage.getItem(STORAGE_KEY) === initialVersion) {
      setVersion(null);
      return; // No need to fetch — user dismissed this version
    }

    let cancelled = false;

    async function check() {
      try {
        const tags = await fetchJson(
          `https://api.github.com/repos/${REPO}/tags?per_page=1`
        );
        if (cancelled || !tags.length) return;

        const tag = tags[0];
        const commitData = await fetchJson(
          `https://api.github.com/repos/${REPO}/commits/${tag.commit.sha}`
        );
        if (cancelled) return;

        const tagDate = new Date(commitData.commit.author.date);
        const ageDays = (Date.now() - tagDate.getTime()) / (1000 * 60 * 60 * 24);

        if (ageDays > MAX_AGE_DAYS) return;

        const dismissedVersion = localStorage.getItem(STORAGE_KEY);
        if (dismissedVersion === tag.name) return;

        setVersion(tag.name);
      } catch {
        // Graceful degradation — keep build-time version if set, show nothing otherwise
      }
    }

    check();
    return () => { cancelled = true; };
  }, [fetchJson, initialVersion]);

  const handleDismiss = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissing(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, version);
      setDismissed(true);
    }, 250);
  }, [version]);

  if (!version || dismissed) return null;

  const displayVersion = version.startsWith('v') || version.startsWith('V')
    ? version
    : `V${version}`;

  return (
    <div className={`${styles.banner} ${dismissing ? styles.dismissing : ''}`}>
      <Link to="/updates" className={styles.link} title="View the changelog, to see what's new!">
        Dashy {displayVersion} is now live 🚀
      </Link>
      <Link to="/updates" className={styles.link2} title="View the changelog, to see what's new!">
         See what's new…
      </Link>
      <button
        className={styles.closeBtn}
        onClick={handleDismiss}
        title="Dismiss update, and don't show again"
        aria-label="Dismiss update, and don't show again"
      >
        ×
      </button>
    </div>
  );
}
