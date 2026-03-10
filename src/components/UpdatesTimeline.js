import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from '../styles/Updates.module.scss';

const REPO = 'lissy93/dashy';
const PER_PAGE_COMMITS = 30;
const MAX_TAG_DATE_FETCHES = 20;

function stripMarkdown(text) {
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/[*_~`>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function relativeDate(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

function monthYearKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthYearLabel(key) {
  const [year, month] = key.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function normalizeRelease(r) {
  const body = r.body ? stripMarkdown(r.body).slice(0, 200) : '';
  return {
    type: 'release',
    date: new Date(r.published_at),
    title: r.name || r.tag_name,
    body: body || undefined,
    url: r.html_url,
    author: r.author?.login,
    avatarUrl: r.author?.avatar_url,
    tagName: r.tag_name,
  };
}

function normalizeTag(tag, date) {
  return {
    type: 'tag',
    date,
    title: tag.name,
    url: `https://github.com/${REPO}/releases/tag/${tag.name}`,
    tagName: tag.name,
  };
}

function normalizeCommit(c) {
  const message = c.commit?.message || '';
  return {
    type: 'commit',
    date: new Date(c.commit?.author?.date || c.commit?.committer?.date),
    title: message.split('\n')[0],
    url: c.html_url,
    author: c.author?.login || c.commit?.author?.name,
    avatarUrl: c.author?.avatar_url,
    sha: c.sha?.slice(0, 7),
  };
}

function TimelineEntry({ entry }) {
  if (entry.type === 'release') {
    return (
      <div
        className={`${styles.entry} ${styles.releaseEntry}`}
        role="article"
        aria-label={`Release: ${entry.title}`}
      >
        <div className={styles.releaseCard}>
          <div className={styles.entryTitle}>
            {entry.title}
            <span className={`${styles.badge} ${styles.badgeRelease}`}>Release</span>
            {entry.tagName && <span className={styles.tagPill}>{entry.tagName}</span>}
          </div>
          {entry.body && <p className={styles.bodyPreview}>{entry.body}</p>}
          <div className={styles.meta}>
            {entry.avatarUrl && (
              <span className={styles.authorInfo}>
                <a href={`https://github.com/${entry.author}`} target="_blank" rel="noopener noreferrer" className={styles.authorLink}>
                  {entry.avatarUrl && (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.author}
                      className={styles.avatarSmall}
                      loading="lazy"
                    />
                  )}
                {entry.author && <span>{entry.author}</span>}
                </a>
              </span>
            )}
            <time dateTime={entry.date.toISOString()}>{relativeDate(entry.date)}</time>
            <span className={styles.viewOnLabel}>View on:</span>
            <a href={entry.url} target="_blank" rel="noopener noreferrer">
              <img className={styles.providerIcon} src="https://cdn.as93.net/k1pcts?w=32" />
              GitHub
            </a>
            <a href={`https://hub.docker.com/layers/lissy93/dashy/${entry.title}`} target="_blank" rel="noopener noreferrer">
                <img className={styles.providerIcon} src="https://cdn.as93.net/t2hnw4?w=32" />
                DockerHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (entry.type === 'tag') {
    return (
      <div
        className={`${styles.entry} ${styles.tagEntry}`}
        role="article"
        aria-label={`Tag: ${entry.title}`}
      >
        <div className={styles.tagCard}>
          <div className={styles.entryTitle}>
            {entry.title}
            <span className={`${styles.badge} ${styles.badgeTag}`}>Tag</span>
          </div>
          <div className={styles.meta}>
            <time dateTime={entry.date.toISOString()}>{relativeDate(entry.date)}</time>
            <span className={styles.viewOnLabel}>View on:</span>
            <a href={entry.url} target="_blank" rel="noopener noreferrer">
            <img className={styles.providerIcon} src="https://cdn.as93.net/k1pcts?w=32" />
              GitHub
            </a>
            <a href={`https://hub.docker.com/layers/lissy93/dashy/${entry.title}`} target="_blank" rel="noopener noreferrer">
                <img className={styles.providerIcon} src="https://cdn.as93.net/t2hnw4?w=32" />
                DockerHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Commit
  return (
    <div
      className={`${styles.entry} ${styles.commitEntry}`}
      role="article"
      aria-label={`Commit: ${entry.title}`}
    >
      <a
        href={entry.url}
        className={styles.commitRow}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.sha}>{entry.sha}</span>
        <span className={styles.commitMsg}>{entry.title}</span>
        <span className={styles.commitMeta}>
          <a href={`https://github.com/${entry.author}`} target="_blank" rel="noopener noreferrer" className={styles.authorLink}>
            {entry.avatarUrl && (
              <img
                src={entry.avatarUrl}
                alt={entry.author}
                className={styles.avatarSmall}
                loading="lazy"
              />
            )}
          {entry.author && <span>{entry.author}</span>}
          </a>
          {entry.author && ' · '}
          <time dateTime={entry.date.toISOString()}>{relativeDate(entry.date)}</time>
        </span>
      </a>
    </div>
  );
}

export default function UpdatesTimeline() {
  const { siteConfig } = useDocusaurusContext();
  const githubToken = siteConfig.customFields?.githubToken || '';
  const pluginData = usePluginData('github-data');

  const initialReleases = useMemo(() => {
    if (!pluginData?.releases) return [];
    return pluginData.releases.map(r => normalizeRelease({
      tag_name: r.tag_name,
      name: r.name,
      published_at: r.published_at,
      body: r.body,
      html_url: r.html_url,
      author: r.author_login ? { login: r.author_login, avatar_url: r.author_avatar } : null,
    }));
  }, [pluginData]);

  const initialTags = useMemo(() => {
    if (!pluginData?.tags) return [];
    return pluginData.tags.map(t => normalizeTag({ name: t.name }, new Date(t.date)));
  }, [pluginData]);

  const initialCommits = useMemo(() => {
    if (!pluginData?.commits) return [];
    return pluginData.commits.map(c => normalizeCommit({
      sha: c.sha,
      commit: { message: c.message, author: { date: c.date } },
      author: c.author_login ? { login: c.author_login, avatar_url: c.author_avatar } : null,
      html_url: c.html_url,
    }));
  }, [pluginData]);

  const hasBuildData = initialReleases.length > 0 || initialTags.length > 0 || initialCommits.length > 0;

  const [releases, setReleases] = useState(initialReleases);
  const [tags, setTags] = useState(initialTags);
  const [commits, setCommits] = useState(initialCommits);
  const [loading, setLoading] = useState(!hasBuildData);
  const [error, setError] = useState(false);
  const [fetchErrors, setFetchErrors] = useState([]);
  const [commitPage, setCommitPage] = useState(
    initialCommits.length > 0 ? Math.ceil(initialCommits.length / PER_PAGE_COMMITS) : 1
  );
  const [hasMoreCommits, setHasMoreCommits] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

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
    let cancelled = false;
    const haveBuildReleases = initialReleases.length > 0;
    const haveBuildTags = initialTags.length > 0;
    const haveBuildCommits = initialCommits.length > 0;

    async function loadInitial() {
      // Always refresh releases + tags (small payloads, catches new activity).
      // Only fetch commits if we have no build-time data — otherwise "Load More"
      // handles older pages incrementally.
      const fetches = [
        fetchJson(`https://api.github.com/repos/${REPO}/releases?per_page=100`),
        fetchJson(`https://api.github.com/repos/${REPO}/tags?per_page=100`),
      ];
      if (!haveBuildCommits) {
        fetches.push(
          fetchJson(`https://api.github.com/repos/${REPO}/commits?per_page=${PER_PAGE_COMMITS}&page=1`),
        );
      }

      const results = await Promise.allSettled(fetches);

      if (cancelled) return;

      let anySucceeded = haveBuildReleases || haveBuildTags || haveBuildCommits;
      const errors = [];

      // Releases
      if (results[0].status === 'fulfilled') {
        anySucceeded = true;
        setReleases(results[0].value.map(normalizeRelease));

        // Resolve tag dates for non-release tags
        if (results[1].status === 'fulfilled') {
          const releaseTagNames = new Set(results[0].value.map(r => r.tag_name));
          const nonReleaseTags = results[1].value
            .filter(t => !releaseTagNames.has(t.name))
            .slice(0, MAX_TAG_DATE_FETCHES);

          if (nonReleaseTags.length > 0) {
            const tagResults = await Promise.allSettled(
              nonReleaseTags.map(t =>
                fetchJson(`https://api.github.com/repos/${REPO}/commits/${t.commit.sha}`)
                  .then(c => ({ tag: t, date: new Date(c.commit.author.date) }))
              )
            );

            if (!cancelled) {
              const resolvedTags = tagResults
                .filter(r => r.status === 'fulfilled')
                .map(r => normalizeTag(r.value.tag, r.value.date));
              // Only overwrite if we resolved at least one — don't wipe build-time tags
              if (resolvedTags.length > 0) setTags(resolvedTags);
            }
          }
        }
      } else if (!haveBuildReleases) {
        errors.push('releases');
      }

      // Tags succeeded but releases failed — resolve all tag dates
      if (results[1].status === 'fulfilled' && results[0].status !== 'fulfilled') {
        anySucceeded = true;
        const tagsToResolve = results[1].value.slice(0, MAX_TAG_DATE_FETCHES);
        const tagResults = await Promise.allSettled(
          tagsToResolve.map(t =>
            fetchJson(`https://api.github.com/repos/${REPO}/commits/${t.commit.sha}`)
              .then(c => ({ tag: t, date: new Date(c.commit.author.date) }))
          )
        );
        if (!cancelled) {
          const resolvedTags = tagResults
            .filter(r => r.status === 'fulfilled')
            .map(r => normalizeTag(r.value.tag, r.value.date));
          if (resolvedTags.length > 0) setTags(resolvedTags);
        }
      }

      if (results[1].status === 'rejected' && !haveBuildTags) {
        errors.push('tags');
      }

      // Commits — only fetched when no build-time data
      if (results[2]) {
        if (results[2].status === 'fulfilled') {
          anySucceeded = true;
          const data = results[2].value;
          setCommits(data.map(normalizeCommit));
          if (data.length < PER_PAGE_COMMITS) setHasMoreCommits(false);
        } else if (!haveBuildCommits) {
          errors.push('commits');
        }
      }

      if (errors.length > 0 && anySucceeded) setFetchErrors(errors);
      if (!anySucceeded) setError(true);
      setLoading(false);
    }

    loadInitial();
    return () => { cancelled = true; };
  }, [fetchJson, initialReleases, initialTags, initialCommits]);

  const loadMoreCommits = useCallback(async () => {
    setLoadingMore(true);
    const nextPage = commitPage + 1;
    try {
      const data = await fetchJson(
        `https://api.github.com/repos/${REPO}/commits?per_page=${PER_PAGE_COMMITS}&page=${nextPage}`
      );
      setCommits(prev => [...prev, ...data.map(normalizeCommit)]);
      setCommitPage(nextPage);
      if (data.length < PER_PAGE_COMMITS) setHasMoreCommits(false);
    } catch {
      setHasMoreCommits(false);
      setLoadMoreError(true);
    }
    setLoadingMore(false);
  }, [commitPage, fetchJson]);

  const grouped = useMemo(() => {
    const all = [...releases, ...tags, ...commits]
      .filter(e => e.date instanceof Date && !isNaN(e.date))
      .sort((a, b) => b.date - a.date);
    const groups = [];
    let currentKey = null;
    let currentEntries = [];

    for (const entry of all) {
      const key = monthYearKey(entry.date);
      if (key !== currentKey) {
        if (currentKey) groups.push({ key: currentKey, label: monthYearLabel(currentKey), entries: currentEntries });
        currentKey = key;
        currentEntries = [];
      }
      currentEntries.push(entry);
    }
    if (currentKey) groups.push({ key: currentKey, label: monthYearLabel(currentKey), entries: currentEntries });

    return groups;
  }, [releases, tags, commits]);

  if (loading) {
    return (
      <div className={styles.timeline}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <p>Unable to load project activity right now.</p>
        <p>
          Check out the{' '}
          <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>{' '}
          directly.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Dashy project activity timeline">
      <div className={styles.timeline}>
        {grouped.map(group => (
          <div key={group.key}>
            <h2 className={styles.monthHeader}>{group.label}</h2>
            {group.entries.map((entry, i) => (
              <TimelineEntry key={`${entry.type}-${entry.sha || entry.tagName || ''}-${i}`} entry={entry} />
            ))}
          </div>
        ))}
      </div>
      {fetchErrors.length > 0 && (
        <div className={styles.fetchErrorCard}>
          <p>Unable to fetch some data dynamically.{' '}
            <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a> instead.
          </p>
        </div>
      )}
      {hasMoreCommits && !loadMoreError && (
        <div className={styles.loadMore}>
          <button
            className="button color-btn btn-blue"
            onClick={loadMoreCommits}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      {loadMoreError && (
        <div className={styles.fetchErrorCard}>
          <p>Unable to fetch dynamically.{' '}
            <a href={`https://github.com/${REPO}/commits`} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a> instead.
          </p>
        </div>
      )}
    </section>
  );
}
