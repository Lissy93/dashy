import React, { useState, useEffect, useRef, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import IconUsers from '../../static/icons/stats_users.svg';
import IconStars from '../../static/icons/stats_stars.svg';
import IconDownloads from '../../static/icons/stats_downloads.svg';
import IconDocs from '../../static/icons/stats_docs.svg';
import styles from '../styles/Stats.module.scss';

const DEFAULTS = [
  { label: 'Contributors', value: '160', Icon: IconUsers, color: '#db78fc' },
  { label: 'GitHub Stars', value: '24k', Icon: IconStars, color: '#5c85f7' },
  { label: 'Docker Downloads', value: '15M', Icon: IconDownloads, color: '#41ef90' },
  { label: 'Doc Site Views', value: '5M', Icon: IconDocs, color: '#dcff5a' },
];

function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function parseValue(str) {
  const match = str.match(/^([\d.]+)([a-zA-Z]*)$/);
  if (!match) return { num: 0, suffix: str };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

function useCountUp(targetValue, duration = 1500) {
  const { num: target, suffix } = parseValue(targetValue);
  const [display, setDisplay] = useState(targetValue);
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const prevValue = useRef(targetValue);

  // Reset animation state when targetValue changes (e.g. live data arrives)
  if (prevValue.current !== targetValue) {
    prevValue.current = targetValue;
    hasAnimated.current = false;
  }

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(targetValue);
      return;
    }

    const start = target * 0.8;
    const range = target - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + range * eased;
      const formatted = suffix
        ? `${current.toFixed(target < 10 ? 1 : (target % 1 !== 0 ? 1 : 0))}${suffix}`
        : String(Math.round(current));
      setDisplay(formatted);
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(targetValue);
    }

    requestAnimationFrame(step);
  }, [target, suffix, targetValue, duration]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(targetValue);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { animate(); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animate, targetValue]);

  return { ref, display };
}

function StatItem({ label, value, Icon, color }) {
  const { ref, display } = useCountUp(value);
  return (
    <div className={styles.statItem} ref={ref} style={{ '--stat-color': color }}>
      <Icon className={styles.icon} aria-hidden="true" />
      <span className={styles.count}>{display}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

function StatsInner() {
  const { siteConfig } = useDocusaurusContext();
  const githubToken = siteConfig.customFields?.githubToken || '';
  const [stats, setStats] = useState(DEFAULTS);

  useEffect(() => {
    const headers = { 'User-Agent': 'dashy-docs' };
    if (githubToken) headers['Authorization'] = `token ${githubToken}`;

    const fetchStats = async () => {
      const updates = [...DEFAULTS];

      const results = await Promise.allSettled([
        fetch('https://api.github.com/repos/lissy93/dashy', { headers }).then(r => r.ok ? r.json() : null),
        fetch('https://hub.docker.com/v2/repositories/lissy93/dashy/').then(r => r.ok ? r.json() : null),
        fetch('https://api.github.com/repos/lissy93/dashy/contributors?per_page=1&anon=true', { headers }),
      ]);

      // Stars
      if (results[0].status === 'fulfilled' && results[0].value) {
        const stars = results[0].value.stargazers_count;
        if (stars) updates[1] = { ...updates[1], value: formatNumber(stars) };
      }

      // Docker pulls
      if (results[1].status === 'fulfilled' && results[1].value) {
        const pulls = results[1].value.pull_count;
        if (pulls) updates[2] = { ...updates[2], value: formatNumber(pulls) };
      }

      // Contributors count from Link header
      if (results[2].status === 'fulfilled') {
        try {
          const linkHeader = results[2].value.headers.get('Link');
          if (linkHeader) {
            const lastMatch = linkHeader.match(/&page=(\d+)>;\s*rel="last"/);
            if (lastMatch) {
              updates[0] = { ...updates[0], value: formatNumber(parseInt(lastMatch[1], 10)) };
            }
          }
        } catch {}
      }

      setStats(updates);
    };

    fetchStats();
  }, [githubToken]);

  return (
    <section className={styles.statsSection} aria-label="Dashy project statistics">
      <div className={styles.inner}>
        {stats.map((s) => (
          <StatItem key={s.label} label={s.label} value={s.value} Icon={s.Icon} color={s.color} />
        ))}
      </div>
    </section>
  );
}

export default function Stats() {
  try {
    return <StatsInner />;
  } catch {
    return null;
  }
}
