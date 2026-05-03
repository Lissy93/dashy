/**
 * Dashy's $toast plugin, for action/toast notifications
 *
 * Usage: registered globally as `$toast` — no import needed in components.
 *   this.$toast('Saved');                         // neutral info toast
 *   this.$toast.success('Saved successfully');
 *   this.$toast.error('Something broke', { duration: 0 }); // 0 = sticky
 *   this.$toast.show(msg, { type, duration, dismissible, action, html });
 *
 * Options:
 *   type         'info' | 'success' | 'error' | 'warning'    (default 'info')
 *   duration     ms before auto-dismiss; 0 = sticky          (default 3000)
 *   dismissible  show close button                            (default false)
 *   action       { text, onClick }                            (default none)
 *   html         render content as sanitized HTML             (default false)
 *   className    extra class(es) on the toast
 *   onClose      callback when toast is removed
 *
 * Returns { id, dismiss } from show() so callers can dismiss programmatically.
 */
import DOMPurify from 'dompurify';

const DEFAULTS = { type: 'info', duration: 3000, dismissible: false };
const MAX_STACK = 5;
const TRANSITION_MS = 200;
const CONTAINER_ID = 'dashy-toasts';

let idCounter = 0;
let stylesInjected = false;
let containerEl = null;
const toasts = new Map();

function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.id = 'dashy-toast-styles';
  style.textContent = `
    #${CONTAINER_ID} {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      z-index: 99;
      display: flex;
      flex-direction: column-reverse;
      gap: 0.5rem;
      width: max-content;
      max-width: min(90vw, 32rem);
      pointer-events: none;
      transform: translateX(-50%);
    }
    .dashy-toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.9rem;
      border: 1px solid var(--toast-color);
      border-radius: var(--curve-factor);
      background: var(--toast-background);
      color: var(--toast-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      line-height: 1.3;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(1rem);
      transition: opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease;
    }
    .dashy-toast.is-visible {
      opacity: 1;
      transform: translateY(0);
      }
    .dashy-toast.is-leaving {
      opacity: 0;
    }
    .dashy-toast--success {
      background: var(--success);
      border-color: transparent;
      color: #fff;
    }
    .dashy-toast--error {
      background: var(--danger);
      border-color: transparent;
      color: #fff;
    }
    .dashy-toast--warning {
      background: var(--warning);
      border-color: transparent;
      color: #fff;
    }
    .dashy-toast__msg {
      flex: 1;
      min-width: 0;
      overflow-wrap: break-word;
    }
    .dashy-toast__action,
    .dashy-toast__close {
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .dashy-toast__action {
      padding: 0.2rem 0.6rem;
      border: 1px solid currentColor;
      border-radius: 2px;
    }
    .dashy-toast__close {
      padding: 0 0.25rem;
      border: 0;
      font-size: 1.25rem;
      line-height: 1;
      opacity: 0.7;
    }
    .dashy-toast__action:hover,
    .dashy-toast__action:focus-visible {
      background: rgba(255, 255, 255, 0.15);
    }
    .dashy-toast__close:hover,
    .dashy-toast__close:focus-visible {
      opacity: 1;
    }
    @media (max-width: 600px) {
      #${CONTAINER_ID} {
        left: 0.5rem;
        right: 0.5rem;
        width: auto;
        max-width: none;
        transform: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .dashy-toast {
        transition: opacity ${TRANSITION_MS}ms ease; transform: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureContainer() {
  if (containerEl?.isConnected) return containerEl;
  containerEl = document.createElement('div');
  containerEl.id = CONTAINER_ID;
  containerEl.setAttribute('role', 'region');
  containerEl.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(containerEl);
  return containerEl;
}

function dismiss(id) {
  const t = toasts.get(id);
  if (!t) return;
  clearTimeout(t.timer);
  toasts.delete(id);
  t.el.classList.add('is-leaving');
  t.el.classList.remove('is-visible');
  setTimeout(() => {
    t.el.remove();
    if (containerEl && !containerEl.children.length) {
      containerEl.remove();
      containerEl = null;
    }
    t.onClose?.();
  }, TRANSITION_MS);
}

function clear() { [...toasts.keys()].forEach(dismiss); }

function show(message, opts = {}) {
  if (message == null || message === '') return { id: null, dismiss: () => {} };
  injectStyles();
  const container = ensureContainer();

  // Evict oldest if stack full
  if (toasts.size >= MAX_STACK) dismiss(toasts.keys().next().value);

  const cfg = { ...DEFAULTS, ...opts };
  const id = ++idCounter;
  const isError = cfg.type === 'error';

  const el = document.createElement('div');
  el.className = `dashy-toast dashy-toast--${cfg.type}`;
  if (cfg.className) el.classList.add(...String(cfg.className).split(/\s+/).filter(Boolean));
  el.setAttribute('role', isError ? 'alert' : 'status');
  el.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  el.setAttribute('aria-atomic', 'true');

  const msg = document.createElement('div');
  msg.className = 'dashy-toast__msg';
  if (cfg.html) msg.innerHTML = DOMPurify.sanitize(String(message));
  else msg.textContent = String(message);
  el.appendChild(msg);

  if (cfg.action?.text) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dashy-toast__action';
    btn.textContent = cfg.action.text;
    btn.addEventListener('click', () => { cfg.action.onClick?.(); dismiss(id); });
    el.appendChild(btn);
  }

  const needsClose = cfg.dismissible || cfg.duration === 0;
  if (needsClose) {
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dashy-toast__close';
    close.setAttribute('aria-label', 'Close notification');
    close.innerHTML = '&times;';
    close.addEventListener('click', () => dismiss(id));
    el.appendChild(close);
  }

  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));

  const entry = { el, timer: null, onClose: cfg.onClose };
  toasts.set(id, entry);

  if (cfg.duration > 0) {
    const start = () => { entry.timer = setTimeout(() => dismiss(id), cfg.duration); };
    start();
    el.addEventListener('mouseenter', () => clearTimeout(entry.timer));
    el.addEventListener('mouseleave', start);
    el.addEventListener('focusin', () => clearTimeout(entry.timer));
    el.addEventListener('focusout', start);
  }

  return { id, dismiss: () => dismiss(id) };
}

// Callable API: $toast(msg) + helpers
const toast = (msg, opts) => show(msg, opts);
toast.show = show;
toast.success = (msg, opts) => show(msg, { ...opts, type: 'success' });
toast.error = (msg, opts) => show(msg, { ...opts, type: 'error' });
toast.info = (msg, opts) => show(msg, { ...opts, type: 'info' });
toast.warning = (msg, opts) => show(msg, { ...opts, type: 'warning' });
toast.dismiss = dismiss;
toast.clear = clear;

export { toast };

export default {
  install(app) {
    app.config.globalProperties.$toast = toast;
  },
};
