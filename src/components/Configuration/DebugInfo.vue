<template>
  <div class="debug-info">
    <!-- Resources -->
    <section>
      <h3>{{ $t('debug.getting-help') }}</h3>
      <p>{{ $t('debug.getting-help-msg') }}</p>
      <ul>
        <li v-for="r in resources" :key="r.id">
          <a :href="r.url" target="_blank" rel="noopener noreferrer">{{
            $t(`debug.resources.${r.id}-name`) }}</a>
          - <i v-if="r.noteKey">{{ $t(`debug.resources.${r.noteKey}`) }}</i>
          {{ $t(`debug.resources.${r.id}-desc`) }}
        </li>
      </ul>
    </section>

    <!-- Raising bugs -->
    <section>
      <h3>{{ $t('debug.reporting-bug') }}</h3>
      <p>
        {{ $t('debug.reporting-bug-l1-prefix') }}
        <a href="https://github.com/Lissy93/dashy/issues/new/choose"
          target="_blank" rel="noopener noreferrer">{{
            $t('debug.reporting-bug-l1-link') }}</a>
        {{ $t('debug.reporting-bug-l1-suffix') }}
      </p>
      <p>{{ $t('debug.reporting-bug-l2-intro') }}</p>
      <ul>
        <li v-for="item in bugReportItems" :key="item">
          {{ $t(`debug.reporting-bug-list.${item}`) }}
        </li>
      </ul>
      <p class="hint">{{ $t('debug.reporting-bug-note') }}</p>
    </section>

    <!-- App Version -->
    <section>
      <h3>{{ $t('debug.app-version') }}</h3>
      <AppVersion class="version-block" />
    </section>

    <!-- Error Log -->
    <section>
      <h3>{{ $t('debug.error-log') }}</h3>
      <p class="hint">
        {{ $t('debug.error-log-hint-prefix') }}
        <a href="https://dashy.to/docs/troubleshooting/#how-to-open-browser-console"
          target="_blank" rel="noopener noreferrer">{{
            $t('debug.error-log-hint-link') }}</a>
        {{ $t('debug.error-log-hint-suffix') }}
      </p>
      <pre v-if="errorLog" class="log-block"><code>{{ errorLog }}</code></pre>
      <p v-else class="empty">{{ $t('debug.no-errors') }}</p>
    </section>

    <!-- Current Config -->
    <section>
      <h3>{{ $t('debug.current-config') }}</h3>
      <p class="hint">{{ $t('debug.current-config-hint') }}</p>
      <pre class="log-block"><code>{{ currentConfigYaml }}</code></pre>
    </section>

    <!-- Local Storage -->
    <section>
      <h3>{{ $t('debug.local-storage') }}</h3>
      <p class="hint">{{ $t('debug.local-storage-hint') }}</p>
      <pre v-if="localStorageDump" class="log-block"><code>{{ localStorageDump }}</code></pre>
      <p v-else class="empty">{{ $t('debug.no-local-storage') }}</p>
    </section>

    <!-- Environment -->
    <section>
      <h3>{{ $t('debug.environment') }}</h3>
      <p class="hint">{{ $t('debug.environment-hint') }}</p>
      <dl class="env-grid">
        <template v-for="row in envRows" :key="row.key">
          <dt>{{ $t(`debug.env.${row.key}`) }}</dt>
          <dd>{{ row.value }}</dd>
        </template>
      </dl>
    </section>
  </div>
</template>

<script>
import { dump as yamlDump } from 'js-yaml';
import AppVersion from '@/components/Configuration/AppVersion';
import { sessionStorageKeys } from '@/utils/config/defaults';
import { ErrorHandler } from '@/utils/logging/ErrorHandler';

const RESOURCES = [
  { id: 'troubleshooting', url: 'https://dashy.to/docs/troubleshooting/' },
  { id: 'docs', url: 'https://dashy.to/docs/' },
  { id: 'source', url: 'https://github.com/Lissy93/dashy/' },
  { id: 'email', url: 'mailto:dashy-support@mail.as93.net', noteKey: 'email-note' },
];

const BUG_REPORT_ITEMS = ['version', 'deployment', 'errors', 'config', 'overrides', 'environment'];

/* Sensitive keys whose values are hidden in the debug view (still listed by name) */
const REDACTED_KEYS = ['keycloakInfo', 'backupHash'];
const isRedacted = (key) => REDACTED_KEYS.some((k) => key === k || key.startsWith(`${k}_`));

/* Run a getter, returning its value or the supplied fallback on error/empty */
const safe = (label, fn, fallback) => {
  try {
    const v = fn();
    return v == null || v === '' ? fallback : v;
  } catch (e) {
    ErrorHandler(`Failed to read env info '${label}': ${e.message}`);
    return fallback;
  }
};

/* Parse a friendly browser label from a UA string. Returns null if unrecognised. */
const parseBrowser = (ua) => {
  if (!ua) return null;
  const major = (re) => ((ua.match(re) || [])[1] || '').split('.')[0];
  if (/Edg\//.test(ua)) return `Edge ${major(/Edg\/(\S+)/)}`.trim();
  if (/OPR\//.test(ua)) return `Opera ${major(/OPR\/(\S+)/)}`.trim();
  if (/Firefox\//.test(ua)) return `Firefox ${major(/Firefox\/(\S+)/)}`.trim();
  if (/Chrome\//.test(ua)) return `Chrome ${major(/Chrome\/(\S+)/)}`.trim();
  if (/Safari\//.test(ua)) return `Safari ${major(/Version\/(\S+)/)}`.trim();
  return null;
};

/* Parse a friendly OS label from a UA string. Returns null if unrecognised. */
const parseOs = (ua) => {
  if (!ua) return null;
  if (/Windows NT/.test(ua)) {
    const v = (ua.match(/Windows NT (\d+\.\d+)/) || [])[1];
    const map = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
    return `Windows ${map[v] || v || ''}`.trim();
  }
  if (/Mac OS X/.test(ua)) {
    const v = (ua.match(/Mac OS X (\d+[._]\d+)/) || [])[1] || '';
    return `macOS ${v.replace(/_/g, '.')}`.trim();
  }
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Android/.test(ua)) return `Android ${(ua.match(/Android (\d+)/) || [])[1] || ''}`.trim();
  if (/Linux/.test(ua)) return 'Linux';
  return null;
};

export default {
  name: 'DebugInfo',
  components: { AppVersion },
  data() {
    return {
      resources: RESOURCES,
      bugReportItems: BUG_REPORT_ITEMS,
      errorLog: sessionStorage.getItem(sessionStorageKeys.ERROR_LOG) || '',
    };
  },
  computed: {
    /* The current config being used */
    currentConfigYaml() {
      try {
        return yamlDump(this.$store.state.configSource);
      } catch (e) {
        return this.$t('debug.config-render-error', { error: String(e) });
      }
    },
    /* Gets dump of local overrides */
    localStorageDump() {
      try {
        const entries = Object.keys(localStorage).sort().map((key) => {
          if (isRedacted(key)) return [key, '[redacted]'];
          const raw = localStorage.getItem(key);
          try { return [key, JSON.parse(raw)]; } catch { return [key, raw]; }
        });
        return entries.length ? JSON.stringify(Object.fromEntries(entries), null, 2) : '';
      } catch (e) {
        return this.$t('debug.local-storage-error', { error: String(e) });
      }
    },
    /* Shows user basic environment info */
    envRows() {
      const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
      const unknown = this.$t('debug.env.unknown');
      const yes = this.$t('debug.env.yes');
      const no = this.$t('debug.env.no');
      const yn = (cond) => (cond ? yes : no);
      const probes = [
        ['browser', () => parseBrowser(ua)],
        ['os', () => parseOs(ua) || navigator.userAgentData?.platform],
        ['viewport', () => `${window.innerWidth} × ${window.innerHeight}`],
        ['screen', () => `${window.screen.width} × ${window.screen.height}`],
        ['dpr', () => `${window.devicePixelRatio}x`],
        ['languages',
          () => (navigator.languages || [navigator.language]).filter(Boolean).join(', ')],
        ['timezone', () => Intl.DateTimeFormat().resolvedOptions().timeZone],
        ['colorScheme',
          () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')],
        ['reducedMotion',
          () => yn(window.matchMedia('(prefers-reduced-motion: reduce)').matches)],
        ['online', () => yn(navigator.onLine)],
        ['route', () => window.location.pathname],
        ['mode', () => import.meta.env.MODE],
        ['swActive', () => yn(!!navigator.serviceWorker?.controller)],
      ];
      return probes.map(([key, get]) => ({ key, value: safe(key, get, unknown) }));
    },
  },
};
</script>

<style scoped lang="scss">
.debug-info {
  padding: 1rem 1.25rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);

  ul {
    margin: 0.5rem 0;
    padding-left: 1rem;
  }

  section + section {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--config-settings-color);
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    opacity: 0.85;
  }

  p { margin: 0; line-height: 1.5; }
  p + p { margin-top: 0.5rem; }

  a {
    color: var(--primary);
    text-decoration: none;
    &:hover, &:focus-visible { text-decoration: underline; }
  }

  .empty {
    opacity: 0.6;
    font-style: italic;
  }

  .hint {
    margin: 0 0 0.5rem;
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .log-block {
    margin: 0;
    padding: 0.75rem 1rem;
    max-height: 240px;
    overflow: auto;
    font-family: var(--font-monospace);
    font-size: 0.8rem;
    line-height: 1.4;
    color: var(--white);
    background: var(--black);
    border-radius: var(--curve-factor-small);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .env-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.4rem 1.25rem;
    margin: 0;
    align-items: baseline;
    dt {
      font-weight: 600;
      opacity: 0.7;
    }
    dd {
      margin: 0;
      font-family: var(--font-monospace);
      font-size: 0.85rem;
      word-break: break-word;
    }
  }
}
</style>

<style lang="scss">
.debug-info .version-block {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  p { margin: 0; text-align: left; }
}
</style>
