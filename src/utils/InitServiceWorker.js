import yaml from 'js-yaml';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import { statusMsg, statusErrorMsg } from '@/utils/logging/CoolConsole';
import { toast } from '@/utils/Toast';

const SW_LABEL = 'Service Worker Status';
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // hourly

/* Loads conf.yml and returns the parsed object, or null on failure */
const loadAppConfig = async () => {
  try {
    const { data } = await request.get('/conf.yml');
    return yaml.load(data) || null;
  } catch (e) {
    statusErrorMsg(SW_LABEL, 'Failed to load config for SW check', e);
    return null;
  }
};

/* Best-effort cleanup of any prior service worker (used when user opts out) */
const unregisterAll = async () => {
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (!regs.length) return;
    await Promise.all(regs.map(r => r.unregister().catch(() => {})));
    statusMsg(SW_LABEL, 'Service worker unregistered (opt-out).');
  } catch (e) { /* no-op */ }
};

/* Sticky toast with a Refresh action that swaps in the new SW and reloads */
const promptForUpdate = (updateSW) => {
  const t = i18n.global.t;
  toast(t('updates.sw-update-available'), {
    type: 'info',
    duration: 0,
    dismissible: true,
    action: { text: t('updates.sw-update-action'), onClick: () => updateSW(true) },
  });
};

const initServiceWorker = async () => {
  if (import.meta.env.DEV) return;
  if (!('serviceWorker' in navigator)) return;

  const conf = await loadAppConfig();
  if (!conf) return; // network/parse failed — leave any existing SW alone

  if (!conf.appConfig?.enableServiceWorker) {
    await unregisterAll();
    return;
  }

  try {
    const { registerSW } = await import('virtual:pwa-register');
    const updateSW = registerSW({
      onRegisteredSW(swUrl, reg) {
        statusMsg(SW_LABEL, `Service worker registered (${swUrl}).`);
        if (reg) setInterval(() => reg.update().catch(() => {}), UPDATE_CHECK_INTERVAL_MS);
      },
      onNeedRefresh: () => promptForUpdate(updateSW),
      onOfflineReady: () => statusMsg(SW_LABEL, 'App is ready for offline use.'),
      onRegisterError: (e) => statusErrorMsg(SW_LABEL, 'Error during SW registration', e),
    });
  } catch (e) {
    statusErrorMsg(SW_LABEL, 'Error setting up service worker', e);
  }
};

export default initServiceWorker;
